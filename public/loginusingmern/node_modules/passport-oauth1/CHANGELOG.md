# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2023-03-01
### Added
- `callbackURL` property added to metadata passed to request token store.

## [1.2.0] - 2021-07-02
### Added

- Support for `store: true` option to `Strategy` constructor, which initializes
a request token store capable of storing application-level state.
- Support for `state` object passed as option to `authenticate`, which will be
persisted in the session by request token store.

[Unreleased]: https://github.com/jaredhanson/passport-oauth1/compare/v1.2.0...HEAD
