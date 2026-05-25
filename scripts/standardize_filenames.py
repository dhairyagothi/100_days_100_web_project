#!/usr/bin/env python3
"""Standardize filenames to kebab-case and update references.

Usage: python3 scripts/standardize_filenames.py [--apply]

Runs a dry-run by default and prints a JSON mapping of planned renames.
With --apply it will create a branch, run `git mv` for each file, update references
in text files, and commit the changes.
"""
import argparse
import os
import re
import subprocess
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TARGET_DIRS = [ROOT / 'public']
EXCLUDE_DIRS = [ROOT / 'contributors']
TEXT_EXTS = {'.html', '.htm', '.css', '.js', '.md', '.json', '.txt'}

def is_excluded(p: Path):
    for ex in EXCLUDE_DIRS:
        try:
            if ex in p.parents:
                return True
        except Exception:
            pass
    return False

def sanitize_name(name: str) -> str:
    name = name.strip()
    # special-case: ".env .example" -> ".env.example"
    if name.startswith('.env') and 'example' in name:
        return '.env.example'
    # split extension
    parts = name.split('.')
    if len(parts) == 1:
        base, ext = parts[0], ''
    else:
        ext = parts[-1]
        base = '.'.join(parts[:-1])
    # replace unwanted chars
    base = base.lower()
    base = re.sub(r"[\s_,'()\[\]]+", '-', base)
    base = re.sub(r"[^a-z0-9\-]+", '-', base)
    base = re.sub(r"-+", '-', base)
    base = base.strip('-')
    if ext:
        ext = ext.lower()
        return f"{base}.{ext}" if base else f".{ext}"
    return base

def find_problem_files():
    files = []
    for td in TARGET_DIRS:
        for p in td.rglob('*'):
            if p.is_file() and not is_excluded(p):
                name = p.name
                if (' ' in name) or (',' in name) or (name.count('.') > 1) or re.search(r"[^\w.\-() ]", name) or name.endswith('.bak') or name.startswith('.env ') or any(c.isupper() for c in name):
                    files.append(p)
    return files

def build_mapping(files):
    mapping = {}
    used = set()
    for p in files:
        rel = p.relative_to(ROOT)
        new_name = sanitize_name(p.name)
        new_path = p.with_name(new_name)
        # ensure uniqueness: if clash, append suffix
        counter = 1
        while str(new_path.relative_to(ROOT)) in used or (new_path.exists() and new_path.resolve() != p.resolve()):
            stem = Path(new_name).stem
            ext = Path(new_name).suffix
            new_name = f"{stem}-{counter}{ext}"
            new_path = p.with_name(new_name)
            counter += 1
        used.add(str(new_path.relative_to(ROOT)))
        mapping[str(rel)] = str(new_path.relative_to(ROOT))
    return mapping

def update_references(mapping):
    # For each text file in repo, replace occurrences of old paths with new paths
    for p in ROOT.rglob('*'):
        if p.is_file() and p.suffix.lower() in TEXT_EXTS and not is_excluded(p):
            try:
                s = p.read_text(encoding='utf-8')
            except Exception:
                continue
            orig = s
            for old, new in mapping.items():
                # replace both literal and URL-encoded spaces
                s = s.replace(old, new)
                s = s.replace(old.replace(' ', '%20'), new.replace(' ', '%20'))
                s = s.replace(os.path.basename(old), os.path.basename(new))
            if s != orig:
                p.write_text(s, encoding='utf-8')

def git(cmd, check=True):
    return subprocess.run(['git'] + cmd, cwd=ROOT, check=check, capture_output=True, text=True)

def apply_changes(mapping):
    # create branch
    branch = 'fix/standardize-filenames'
    try:
        git(['checkout', '-b', branch])
    except subprocess.CalledProcessError:
        # maybe branch exists, switch to it
        git(['checkout', branch])
    # perform git mv for each mapping
    for old, new in mapping.items():
        old_p = ROOT / old
        new_p = ROOT / new
        new_p.parent.mkdir(parents=True, exist_ok=True)
        try:
            git(['mv', '-v', old, new])
        except subprocess.CalledProcessError:
            # fallback to os.rename if git mv fails
            try:
                os.rename(old_p, new_p)
            except Exception as e2:
                print(f"Failed to move {old} -> {new}: {e2}")
    # update references
    update_references(mapping)
    # commit
    git(['add', '-A'])
    git(['commit', '-m', 'chore: standardize filenames to kebab-case and update references'])
    print('Applied changes and committed on branch', branch)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()

    files = find_problem_files()
    mapping = build_mapping(files)
    print(json.dumps({'plan': mapping}, indent=2))

    if args.apply:
        apply_changes(mapping)

if __name__ == '__main__':
    main()
