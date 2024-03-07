# Changelog

### [0.1.9](https://github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.8...v0.1.9) (2022-05-11)


### Bug Fixes

* do not use Node.js assert ([#37](https://github.com/googleapis/proto3-json-serializer-nodejs/issues/37)) ([dccfeca](https://github.com/googleapis/proto3-json-serializer-nodejs/commit/dccfeca6f3bbeec29d88319f375a734ec48aadf7))

### [0.1.8](https://github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.7...v0.1.8) (2022-01-21)


### Bug Fixes

* timestamp without millisecond ([#30](https://github.com/googleapis/proto3-json-serializer-nodejs/issues/30)) ([a55d0b6](https://github.com/googleapis/proto3-json-serializer-nodejs/commit/a55d0b6f98f6d1c8b7d971d0a583bbd82ea66983))

### [0.1.7](https://github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.6...v0.1.7) (2022-01-14)


### Bug Fixes

* keep nano second precision when maps between JSON and proto3 ([#28](https://github.com/googleapis/proto3-json-serializer-nodejs/issues/28)) ([eaa01ce](https://github.com/googleapis/proto3-json-serializer-nodejs/commit/eaa01ce92c4eefa816d1d6f8ef6ed11bd2a6364b))

### [0.1.6](https://www.github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.5...v0.1.6) (2021-11-15)


### Bug Fixes

* **deps:** protobufjs is a dependency for the types ([#23](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/23)) ([06470c1](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/06470c1df501439ec3f8bc546cd23d798604f3bd))

### [0.1.5](https://www.github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.4...v0.1.5) (2021-10-26)


### Bug Fixes

* JSON accept special string for NaN, Infinity ([#19](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/19)) ([01a345b](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/01a345b7b1d62ee65a8673737975980d274fa22a))

### [0.1.4](https://www.github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.3...v0.1.4) (2021-09-20)


### Bug Fixes

* do not emit empty lists to JSON ([#15](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/15)) ([af9dfd6](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/af9dfd65efb84cfb31af0faca805f53b0ffa9874))

### [0.1.3](https://www.github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.2...v0.1.3) (2021-08-18)


### Bug Fixes

* do not fail for unknown enum values ([#11](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/11)) ([ff9f0f1](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/ff9f0f1881b1aafacd693b4e24eaee9e56aff79c))

### [0.1.2](https://www.github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.1...v0.1.2) (2021-08-17)


### Bug Fixes

* use imported protobufjs in toproto3json.ts ([#9](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/9)) ([f6c86c7](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/f6c86c777d567d8430b09dea3282e52af24d890f))

### [0.1.1](https://www.github.com/googleapis/proto3-json-serializer-nodejs/compare/v0.1.0...v0.1.1) (2021-08-04)


### Bug Fixes

* accept and return strings for int64 and uint64 ([#7](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/7)) ([35689ec](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/35689ecee55dbe6e4cf3327c535514d7fcb8332d))

## 0.1.0 (2021-08-03)


### ⚠ BREAKING CHANGES

* proto3 JSON serializer and deserializer (#2)

### Features

* proto3 JSON serializer and deserializer ([#2](https://www.github.com/googleapis/proto3-json-serializer-nodejs/issues/2)) ([96255a7](https://www.github.com/googleapis/proto3-json-serializer-nodejs/commit/96255a77c7714f33cae547db9160615d7f80a233))
