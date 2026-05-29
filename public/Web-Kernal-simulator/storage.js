/**
 * WebKernel Virtual File System
 * Simple JSON-based file system backed by localStorage.
 */

const VFS = {
    // Current state of the file system
    data: {
        root: {
            type: 'dir',
            children: {}
        }
    },
    
    // Initialize or load from storage
    init() {
        const saved = localStorage.getItem('webkernel_fs');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
                console.log('VFS: Loaded from storage.');
            } catch (e) {
                console.error('VFS: Corrupt storage, resetting.', e);
                this.save();
            }
        } else {
            // Default initial state
            this.write('/welcome.txt', 'Welcome to WebKernel OS!\nTry the terminal commands.');
            this.save();
        }
    },

    save() {
        localStorage.setItem('webkernel_fs', JSON.stringify(this.data));
    },

    // Traverse path to get the node. Returns null if not found.
    // Path example: '/folder/file.txt'
    _resolve(path) {
        if (path === '/') return this.data.root;
        
        const parts = path.split('/').filter(p => p.length > 0);
        let current = this.data.root;

        for (const part of parts) {
            if (current.type !== 'dir' || !current.children[part]) {
                return null;
            }
            current = current.children[part];
        }
        return current;
    },

    // Get parent directory node from a path
    _resolveParent(path) {
        const parts = path.split('/').filter(p => p.length > 0);
        if (parts.length === 0) return null; // Root has no parent
        
        const filename = parts.pop();
        const parentPath = '/' + parts.join('/');
        
        return {
            parent: this._resolve(parentPath),
            filename: filename
        };
    },

    // Public API
    
    readFile(path) {
        const node = this._resolve(path);
        if (node && node.type === 'file') {
            return node.content;
        }
        return null; // Not found or is a directory
    },

    writeFile(path, content) {
        const res = this._resolveParent(path);
        if (!res || !res.parent || res.parent.type !== 'dir') {
            console.error('VFS: Invalid path or parent not a directory');
            return false;
        }
        
        res.parent.children[res.filename] = {
            type: 'file',
            content: content
        };
        this.save();
        return true;
    },

    createDir(path) {
        const res = this._resolveParent(path);
        if (!res || !res.parent || res.parent.type !== 'dir') {
            return false;
        }
        
        res.parent.children[res.filename] = {
            type: 'dir',
            children: {}
        };
        this.save();
        return true;
    },

    // List contents of a directory. Returns array of names.
    listFiles(path) {
        const node = this._resolve(path);
        if (node && node.type === 'dir') {
            return Object.keys(node.children);
        }
        return null; // Not found or not a directory
    },
    
    exists(path) {
        return this._resolve(path) !== null;
    }
};
