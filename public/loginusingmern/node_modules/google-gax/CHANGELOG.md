# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/gax-nodejs?activeTab=versions

### [2.30.5](https://github.com/googleapis/gax-nodejs/compare/v2.30.4...v2.30.5) (2022-05-23)


### Bug Fixes

* **deps:** update dependency protobufjs to v6.11.3 ([#1272](https://github.com/googleapis/gax-nodejs/issues/1272)) ([6492a2c](https://github.com/googleapis/gax-nodejs/commit/6492a2cc55086439518dcb20cb6001c28e1d2bda))
* **deps:** use protobufjs v6.11.3 ([#1271](https://github.com/googleapis/gax-nodejs/issues/1271)) ([d650c15](https://github.com/googleapis/gax-nodejs/commit/d650c1510cd98958fc32be03b890970f6f321595))

### [2.30.4](https://github.com/googleapis/gax-nodejs/compare/v2.30.3...v2.30.4) (2022-05-09)


### Bug Fixes

* revert gRPC stream change in [#1226](https://github.com/googleapis/gax-nodejs/issues/1226) ([#1257](https://github.com/googleapis/gax-nodejs/issues/1257)) ([1c3a5a7](https://github.com/googleapis/gax-nodejs/commit/1c3a5a7ac54f8fd8e710fe4316c3d5a82072f8f1))
* upgrade proto-loader and add long dev dependency ([#1253](https://github.com/googleapis/gax-nodejs/issues/1253)) ([5dea136](https://github.com/googleapis/gax-nodejs/commit/5dea13698c580283083f41d330a1a2faf37adc5d))

### [2.30.3](https://github.com/googleapis/gax-nodejs/compare/v2.30.2...v2.30.3) (2022-05-03)


### Bug Fixes

* handle stream callback is undefined ([#1238](https://github.com/googleapis/gax-nodejs/issues/1238)) ([269f805](https://github.com/googleapis/gax-nodejs/commit/269f805e02039cfa537084f46a561fa527eba301))
* isolate Rest Stream from retry logic to avoid backpressure ([#1226](https://github.com/googleapis/gax-nodejs/issues/1226)) ([485d5b2](https://github.com/googleapis/gax-nodejs/commit/485d5b2af79d389acf6cc613ce419830ccac6bef))
* pin @grpc/proto-loader to v0.6.9 ([#1242](https://github.com/googleapis/gax-nodejs/issues/1242)) ([bca9a91](https://github.com/googleapis/gax-nodejs/commit/bca9a91f90795970d0bdc0c15ae8a3549d546eba))

### [2.30.2](https://github.com/googleapis/gax-nodejs/compare/v2.30.1...v2.30.2) (2022-04-12)


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ~1.6.0 ([#1207](https://github.com/googleapis/gax-nodejs/issues/1207)) ([2a16b76](https://github.com/googleapis/gax-nodejs/commit/2a16b76237094b42f1afb4667c82adebb87402b8))

### [2.30.1](https://github.com/googleapis/gax-nodejs/compare/v2.30.0...v2.30.1) (2022-03-08)


### Bug Fixes

* do not depend on index.ts from fallback code ([#1201](https://github.com/googleapis/gax-nodejs/issues/1201)) ([5c7ca41](https://github.com/googleapis/gax-nodejs/commit/5c7ca41cc62ad4ea637c09f8c771e084c94ac3d4))
* improve performance of loadProtoJSON ([#1196](https://github.com/googleapis/gax-nodejs/issues/1196)) ([df8eaf9](https://github.com/googleapis/gax-nodejs/commit/df8eaf94e29cff58fa5305e36441d663cb57bd31))

## [2.30.0](https://github.com/googleapis/gax-nodejs/compare/v2.29.7...v2.30.0) (2022-02-23)


### Features

* **deps:** Update `google-auth-library` ([#1190](https://github.com/googleapis/gax-nodejs/issues/1190)) ([7981dc5](https://github.com/googleapis/gax-nodejs/commit/7981dc5c17b509109cb00dda82f603bcb6a2d99c))


### Bug Fixes

* **deps:** update dependency object-hash to v3 ([#1188](https://github.com/googleapis/gax-nodejs/issues/1188)) ([797e69f](https://github.com/googleapis/gax-nodejs/commit/797e69f2dc05785b8a506ea8b91b9178a4db704d))

### [2.29.7](https://github.com/googleapis/gax-nodejs/compare/v2.29.6...v2.29.7) (2022-02-11)


### Bug Fixes

* add close method in fallbackServiceStub ([#1182](https://github.com/googleapis/gax-nodejs/issues/1182)) ([a1153e9](https://github.com/googleapis/gax-nodejs/commit/a1153e9efe4fe011405163aa2279b7a367359c0d))

### [2.29.6](https://github.com/googleapis/gax-nodejs/compare/v2.29.5...v2.29.6) (2022-02-10)


### Bug Fixes

* catch rejected promise from closed client ([#1180](https://github.com/googleapis/gax-nodejs/issues/1180)) ([9e63e65](https://github.com/googleapis/gax-nodejs/commit/9e63e65299b9424088b99cffccc58329c908b793))
* post-process JSDoc link format in proto.d.ts ([#1178](https://github.com/googleapis/gax-nodejs/issues/1178)) ([98dcfcd](https://github.com/googleapis/gax-nodejs/commit/98dcfcd41871586fa5d4d1837a24a4fb4c7a469f))

### [2.29.5](https://github.com/googleapis/gax-nodejs/compare/v2.29.4...v2.29.5) (2022-01-27)


### Bug Fixes

* **deps:** update dependency proto3-json-serializer ([#1173](https://github.com/googleapis/gax-nodejs/issues/1173)) ([dbeb3f7](https://github.com/googleapis/gax-nodejs/commit/dbeb3f752f8a43a3f2984946adbeeea63f111044))
* stream callback is undefined ([#1170](https://github.com/googleapis/gax-nodejs/issues/1170)) ([a693903](https://github.com/googleapis/gax-nodejs/commit/a693903149b804bddc690cc64f187a2f6186b671))

### [2.29.4](https://github.com/googleapis/gax-nodejs/compare/v2.29.3...v2.29.4) (2022-01-19)


### Bug Fixes

* support non-alphanumeric field name ([#1165](https://github.com/googleapis/gax-nodejs/issues/1165)) ([4f53efa](https://github.com/googleapis/gax-nodejs/commit/4f53efaac9b112c4ee38145bd02a59a736e01308))

### [2.29.3](https://github.com/googleapis/gax-nodejs/compare/v2.29.2...v2.29.3) (2022-01-11)


### Bug Fixes

* refactor the showcase stream method collect ([#1162](https://github.com/googleapis/gax-nodejs/issues/1162)) ([19d3a5d](https://github.com/googleapis/gax-nodejs/commit/19d3a5dd61066ae662454e14cd9c340c500ffec0))

### [2.29.2](https://github.com/googleapis/gax-nodejs/compare/v2.29.1...v2.29.2) (2022-01-11)


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ~1.5.0 ([#1152](https://github.com/googleapis/gax-nodejs/issues/1152)) ([775540b](https://github.com/googleapis/gax-nodejs/commit/775540bc81fc9096d96835f4089bf8c508bc23d4))

### [2.29.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.29.0...v2.29.1) (2022-01-06)


### Bug Fixes

* support field name with period ([#1148](https://www.github.com/googleapis/gax-nodejs/issues/1148)) ([80c9146](https://www.github.com/googleapis/gax-nodejs/commit/80c914628c046392cf45527dc6456d3eb3bfa768))

## [2.29.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.28.1...v2.29.0) (2022-01-05)


### Features

* map http status code to grpc status code ([#1135](https://www.github.com/googleapis/gax-nodejs/issues/1135)) ([772222f](https://www.github.com/googleapis/gax-nodejs/commit/772222f1d2e269ceb96bce71c0f18942507f3d4b))
* support server stream for REST ([#1122](https://www.github.com/googleapis/gax-nodejs/issues/1122)) ([9f62723](https://www.github.com/googleapis/gax-nodejs/commit/9f62723762eb72566997e6c8518517e8efddd62d))

### [2.28.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.28.0...v2.28.1) (2021-11-10)


### Bug Fixes

* handle stream has no metadata event ([#1132](https://www.github.com/googleapis/gax-nodejs/issues/1132)) ([ad29bc2](https://www.github.com/googleapis/gax-nodejs/commit/ad29bc26567b588d5d694350844bea5de40963d6))

## [2.28.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.27.1...v2.28.0) (2021-10-19)


### Features

* export google/api/routing.proto ([#1126](https://www.github.com/googleapis/gax-nodejs/issues/1126)) ([c62667e](https://www.github.com/googleapis/gax-nodejs/commit/c62667ed6499b6529203b6d8d66debb854fe1376))


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ~1.4.0 ([#1123](https://www.github.com/googleapis/gax-nodejs/issues/1123)) ([d422711](https://www.github.com/googleapis/gax-nodejs/commit/d4227111154cc4dfee7849750b0eeb8841aa3512))

### [2.27.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.27.0...v2.27.1) (2021-10-01)


### Bug Fixes

* clean up grpc error handling and integration test for promote error info field ([#1110](https://www.github.com/googleapis/gax-nodejs/issues/1110)) ([966b596](https://www.github.com/googleapis/gax-nodejs/commit/966b5965419cdae555a8a6959e5c921f3d3a23c4))

## [2.27.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.26.0...v2.27.0) (2021-09-30)


### Features

* promote error info field in http error ([#1111](https://www.github.com/googleapis/gax-nodejs/issues/1111)) ([a5702bd](https://www.github.com/googleapis/gax-nodejs/commit/a5702bd19ce7daae7fee5b60202bbf834e0621b0))

## [2.26.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.25.4...v2.26.0) (2021-09-27)


### Features

* support customize options for grpc-node. ([#1115](https://www.github.com/googleapis/gax-nodejs/issues/1115)) ([82fb0cb](https://www.github.com/googleapis/gax-nodejs/commit/82fb0cb347211ffa511943febcb22c972f3407d3))

### [2.25.4](https://www.github.com/googleapis/gax-nodejs/compare/v2.25.3...v2.25.4) (2021-09-15)


### Bug Fixes

* editing retry logic ([#1100](https://www.github.com/googleapis/gax-nodejs/issues/1100)) ([05548d5](https://www.github.com/googleapis/gax-nodejs/commit/05548d5ba287af5a8833402108ac55d900889a38))

### [2.25.3](https://www.github.com/googleapis/gax-nodejs/compare/v2.25.2...v2.25.3) (2021-09-14)


### Bug Fixes

* protoCache map key support Buffer type ([#1106](https://www.github.com/googleapis/gax-nodejs/issues/1106)) ([a7ce8ab](https://www.github.com/googleapis/gax-nodejs/commit/a7ce8abc11be39722f6060f74b4d54ce6461dd40))

### [2.25.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.25.1...v2.25.2) (2021-09-10)


### Bug Fixes

* **diregapic:** support field name IPProtocol gRPC transcoding ([#1103](https://www.github.com/googleapis/gax-nodejs/issues/1103)) ([d9c2f21](https://www.github.com/googleapis/gax-nodejs/commit/d9c2f21d80dc9c2c6eda427fddc7cbb2ac1c9f2b))

### [2.25.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.25.0...v2.25.1) (2021-09-03)


### Bug Fixes

* **build:** migrate to main branch ([#1101](https://www.github.com/googleapis/gax-nodejs/issues/1101)) ([713e245](https://www.github.com/googleapis/gax-nodejs/commit/713e24502d96543cbbffaec218cb079351cea26d))

## [2.25.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.24.3...v2.25.0) (2021-09-01)


### Features

* Add compute operation service protos ([#1090](https://www.github.com/googleapis/gax-nodejs/issues/1090)) ([e5ed779](https://www.github.com/googleapis/gax-nodejs/commit/e5ed7792199862e27e1c40de711bfb7c13a9b99c))

### [2.24.3](https://www.github.com/googleapis/gax-nodejs/compare/v2.24.2...v2.24.3) (2021-08-31)


### Bug Fixes

* use the full type name for ErrorInfo ([#1093](https://www.github.com/googleapis/gax-nodejs/issues/1093)) ([c1e646a](https://www.github.com/googleapis/gax-nodejs/commit/c1e646abf148ab55da4dcdfc65e7d2647d0208a9))

### [2.24.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.24.1...v2.24.2) (2021-08-18)


### Bug Fixes

* do not throw error on empty LRO response ([#1087](https://www.github.com/googleapis/gax-nodejs/issues/1087)) ([1978197](https://www.github.com/googleapis/gax-nodejs/commit/197819799f270d886b4372ff4c9b81acd39992b1))

### [2.24.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.24.0...v2.24.1) (2021-08-16)


### Bug Fixes

* **deps:** upgrade google auth to 7.6.1 ([#1085](https://www.github.com/googleapis/gax-nodejs/issues/1085)) ([d297a29](https://www.github.com/googleapis/gax-nodejs/commit/d297a29376d5d2e2a085ddfb754d6cb344d8fb7c))

## [2.24.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.23.0...v2.24.0) (2021-08-12)


### Features

* GoogleError/GoogleErrorDecoder integration testing ([#1075](https://www.github.com/googleapis/gax-nodejs/issues/1075)) ([a1be268](https://www.github.com/googleapis/gax-nodejs/commit/a1be268982d92b659a8d9ef396a18516a69d446b))

## [2.23.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.22.1...v2.23.0) (2021-08-11)


### Features

* promote ErrorInfo fields ([#1070](https://www.github.com/googleapis/gax-nodejs/issues/1070)) ([33ef6bb](https://www.github.com/googleapis/gax-nodejs/commit/33ef6bbadee58a0c4169b21cfdfc0e0d111df69e))

### [2.22.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.22.0...v2.22.1) (2021-08-06)


### Bug Fixes

* refactor path templates to simplify regexes ([#1079](https://www.github.com/googleapis/gax-nodejs/issues/1079)) ([23c43b6](https://www.github.com/googleapis/gax-nodejs/commit/23c43b6f5e368eb2a5d06d375c41df0d7e45ff45))

## [2.22.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.21.1...v2.22.0) (2021-08-05)


### Features

* use proto3 JSON serializer for REGAPIC workflows ([#1074](https://www.github.com/googleapis/gax-nodejs/issues/1074)) ([6ef89f1](https://www.github.com/googleapis/gax-nodejs/commit/6ef89f16fdc3bb09200dc048b4fa5e15d265e973))


### Bug Fixes

* do not fail when decoding unknown error ([#1077](https://www.github.com/googleapis/gax-nodejs/issues/1077)) ([90e19b1](https://www.github.com/googleapis/gax-nodejs/commit/90e19b19b5d84430f929c4f510f4775344669a6b))

### [2.21.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.21.0...v2.21.1) (2021-08-03)


### Bug Fixes

* **deps:** pin protobufjs ([#1071](https://www.github.com/googleapis/gax-nodejs/issues/1071)) ([b2229d5](https://www.github.com/googleapis/gax-nodejs/commit/b2229d53bf46b45541c9d5b729f1441a6fda9a16))

## [2.21.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.20.0...v2.21.0) (2021-08-02)


### Features

* decode error details property from google.rpc.Status ([#1057](https://www.github.com/googleapis/gax-nodejs/issues/1057)) ([2dde63e](https://www.github.com/googleapis/gax-nodejs/commit/2dde63e87c11144e79e523df48756c60c119d404))


### Bug Fixes

* clean up the lint ([#1067](https://www.github.com/googleapis/gax-nodejs/issues/1067)) ([d08e9d5](https://www.github.com/googleapis/gax-nodejs/commit/d08e9d5d67df89a4cecc73f8c00a76adc5e393a2))

## [2.20.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.19.0...v2.20.0) (2021-07-30)


### Features

* support Locations service as mixin service ([#1064](https://www.github.com/googleapis/gax-nodejs/issues/1064)) ([6635b7c](https://www.github.com/googleapis/gax-nodejs/commit/6635b7ce9312f654dc873c9b026e48efa7fd6425))

## [2.19.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.18.0...v2.19.0) (2021-07-15)


### Features

* **compileProtos:** allow to skip JSON file generation ([#1058](https://www.github.com/googleapis/gax-nodejs/issues/1058)) ([dac4d1e](https://www.github.com/googleapis/gax-nodejs/commit/dac4d1efc8c65755e8e2176db1590b3311a13ca1))

## [2.18.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.17.1...v2.18.0) (2021-07-13)


### Features

* make OperationsClient closeable ([#1047](https://www.github.com/googleapis/gax-nodejs/issues/1047)) ([2dbba29](https://www.github.com/googleapis/gax-nodejs/commit/2dbba29dde552fb35c275a4a44b06fb4698eb5cf))
* support map handle for DIREGAPIC Pagination ([#1052](https://www.github.com/googleapis/gax-nodejs/issues/1052)) ([faab4c6](https://www.github.com/googleapis/gax-nodejs/commit/faab4c652c4943fc18c792995180bf59dbd5c7bc))


### Bug Fixes

* make pagination work for empty responses ([#1043](https://www.github.com/googleapis/gax-nodejs/issues/1043)) ([cbe2d3f](https://www.github.com/googleapis/gax-nodejs/commit/cbe2d3f9de4ec01e8e61699b5fa6bf7b34b870a5))
* replace isBrowser() with home made feature detection ([#1054](https://www.github.com/googleapis/gax-nodejs/issues/1054)) ([2c8e56d](https://www.github.com/googleapis/gax-nodejs/commit/2c8e56d5812af7b08ff6d68169d1d8ea325e03c2))

### [2.17.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.17.0...v2.17.1) (2021-07-09)


### Bug Fixes

* **deps:** upgrade google-auth-library ([#1049](https://www.github.com/googleapis/gax-nodejs/issues/1049)) ([3ee8268](https://www.github.com/googleapis/gax-nodejs/commit/3ee82686ffa0baeb432712a13166e73b845b8284))
* types for setImmediate calls ([#1050](https://www.github.com/googleapis/gax-nodejs/issues/1050)) ([a8222eb](https://www.github.com/googleapis/gax-nodejs/commit/a8222eb112f0fc6856a50ecd512d9b52dde0df62))

## [2.17.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.16.0...v2.17.0) (2021-06-24)


### Features

* add enum unit test ([#1037](https://www.github.com/googleapis/gax-nodejs/issues/1037)) ([782ba15](https://www.github.com/googleapis/gax-nodejs/commit/782ba1533fb8bc85eeda13d35727c7d18ec81bf3))

## [2.16.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.15.1...v2.16.0) (2021-06-22)


### Features

* **mtls:** support for GOOGLE_API_USE_CLIENT_CERTIFICATE/GOOGLE_API_USE_MTLS_ENDPOINT ([#1034](https://www.github.com/googleapis/gax-nodejs/issues/1034)) ([cfcb398](https://www.github.com/googleapis/gax-nodejs/commit/cfcb398941ec8392b16e4613894d71982e339850))


### Bug Fixes

* **mtls:** remove unused clientCertSource method ([#1031](https://www.github.com/googleapis/gax-nodejs/issues/1031)) ([5c62b71](https://www.github.com/googleapis/gax-nodejs/commit/5c62b71b3215941106259624c6534eb4a66724bb))

### [2.15.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.15.0...v2.15.1) (2021-06-17)


### Bug Fixes

* support int64 conversion between the pf message and JSON object ([#1028](https://www.github.com/googleapis/gax-nodejs/issues/1028)) ([b46f57d](https://www.github.com/googleapis/gax-nodejs/commit/b46f57dcf88d70f9b8b3fcd5119dd68e02b6a71a))

## [2.15.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.14.1...v2.15.0) (2021-06-10)


### Features

* expose cert and key for mTLS ([#1014](https://www.github.com/googleapis/gax-nodejs/issues/1014)) ([f025fc1](https://www.github.com/googleapis/gax-nodejs/commit/f025fc155c505792bc74929a7803a2df63c331cd))

### [2.14.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.14.0...v2.14.1) (2021-05-27)


### Bug Fixes

* rest transport enum value display incorectly ([#1015](https://www.github.com/googleapis/gax-nodejs/issues/1015)) ([055387b](https://www.github.com/googleapis/gax-nodejs/commit/055387b1f497f6a4132f228d82d95d9a6f6c53f7))

## [2.14.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.13.0...v2.14.0) (2021-05-24)


### Features

* add `gcf-owl-bot[bot]` to `ignoreAuthors` ([#1007](https://www.github.com/googleapis/gax-nodejs/issues/1007)) ([4fac451](https://www.github.com/googleapis/gax-nodejs/commit/4fac45186cea40c0945598636faee5d9d7ba1103))
* add type parameter to warn function ([#1009](https://www.github.com/googleapis/gax-nodejs/issues/1009)) ([fef2e7c](https://www.github.com/googleapis/gax-nodejs/commit/fef2e7c7d81d2187b05542862386c2391e7edd74))
* update rest version for metrics ([#1005](https://www.github.com/googleapis/gax-nodejs/issues/1005)) ([233d6a7](https://www.github.com/googleapis/gax-nodejs/commit/233d6a7dbed5655652a0b5100773cc7837e59a5f))

## [2.13.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.12.0...v2.13.0) (2021-05-12)


### Features

* add validation for proto3 optional default value ([#997](https://www.github.com/googleapis/gax-nodejs/issues/997)) ([c59c153](https://www.github.com/googleapis/gax-nodejs/commit/c59c153f012460d03d69eae4f84700bedbef74a0))


### Bug Fixes

* do not consider inherited properties for transcoding ([#995](https://www.github.com/googleapis/gax-nodejs/issues/995)) ([e0984a1](https://www.github.com/googleapis/gax-nodejs/commit/e0984a1a0f8d31f1aeac308a14b7694f25338531))
* load LRO proto JSON using require ([#1004](https://www.github.com/googleapis/gax-nodejs/issues/1004)) ([62c8055](https://www.github.com/googleapis/gax-nodejs/commit/62c8055f5d0f7b017156444035967e5ac143241b))
* prettier rules change ([#998](https://www.github.com/googleapis/gax-nodejs/issues/998)) ([f75d2b5](https://www.github.com/googleapis/gax-nodejs/commit/f75d2b52b3d5d08cbe593f7269876429a7fd1bc7))

## [2.12.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.11.3...v2.12.0) (2021-04-29)


### Features

* GrpcClient.loadProtoJSON to load protobuf.js JSON proto ([#985](https://www.github.com/googleapis/gax-nodejs/issues/985)) ([819b447](https://www.github.com/googleapis/gax-nodejs/commit/819b447964a635ef2ac75769c0f6eadbd202ddfa))


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ~1.3.0 ([#990](https://www.github.com/googleapis/gax-nodejs/issues/990)) ([f131ee0](https://www.github.com/googleapis/gax-nodejs/commit/f131ee0fb0411f57f43777ca7e3dcec6556115f2))

### [2.11.3](https://www.github.com/googleapis/gax-nodejs/compare/v2.11.2...v2.11.3) (2021-04-22)


### Bug Fixes

* fallback can now be a string ([#983](https://www.github.com/googleapis/gax-nodejs/issues/983)) ([d4e495a](https://www.github.com/googleapis/gax-nodejs/commit/d4e495af46176b8dd74595108f25a6df99ee042d))
* imports for node-fetch when using webpack ([#972](https://www.github.com/googleapis/gax-nodejs/issues/972)) ([505c6b8](https://www.github.com/googleapis/gax-nodejs/commit/505c6b8a3a53f1875617a2258869e4646a0e439b))

### [2.11.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.11.1...v2.11.2) (2021-03-11)


### Bug Fixes

* **compileProtos:** mention library protos before common protos ([#970](https://www.github.com/googleapis/gax-nodejs/issues/970)) ([bf4c9f0](https://www.github.com/googleapis/gax-nodejs/commit/bf4c9f0bd0284542acc2f5e65b88809562763d40))

### [2.11.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.11.0...v2.11.1) (2021-03-10)


### Bug Fixes

* import long in the proto .d.ts files ([#968](https://www.github.com/googleapis/gax-nodejs/issues/968)) ([09d7b13](https://www.github.com/googleapis/gax-nodejs/commit/09d7b13653638a67b43feabace8dbcd1e781ab67))

## [2.11.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.10.3...v2.11.0) (2021-03-10)


### Features

* cache loaded protos ([#966](https://www.github.com/googleapis/gax-nodejs/issues/966)) ([528f975](https://www.github.com/googleapis/gax-nodejs/commit/528f9754d6845eab9b53516cec086dd3b4fa57b6))

### [2.10.3](https://www.github.com/googleapis/gax-nodejs/compare/v2.10.2...v2.10.3) (2021-02-12)


### Bug Fixes

* update google-auth-library to v7.0.2 ([#960](https://www.github.com/googleapis/gax-nodejs/issues/960)) ([f6c6c33](https://www.github.com/googleapis/gax-nodejs/commit/f6c6c33d8055e0b1ff19f0ab7a3955ef7202ec3a))
* use util.TextEncoder, util.TextDecoder for Node 10 ([#957](https://www.github.com/googleapis/gax-nodejs/issues/957)) ([883f7b6](https://www.github.com/googleapis/gax-nodejs/commit/883f7b6bc71b401a4a9f166469a2675f8ea5c48b))

### [2.10.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.10.1...v2.10.2) (2021-02-02)


### Bug Fixes

* query string parameters must be camelCased ([#953](https://www.github.com/googleapis/gax-nodejs/issues/953)) ([1ee2404](https://www.github.com/googleapis/gax-nodejs/commit/1ee2404b89c76416a518e1218214e7529b6859d0))

### [2.10.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.10.0...v2.10.1) (2021-02-01)


### Bug Fixes

* require fast-text-encoding only in browser ([#951](https://www.github.com/googleapis/gax-nodejs/issues/951)) ([33f02e9](https://www.github.com/googleapis/gax-nodejs/commit/33f02e913e13b48070cb9ce027878cd159392501))

## [2.10.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.9.2...v2.10.0) (2021-01-05)


### Features

* REGAPIC: JSON over HTTP/1 ([#939](https://www.github.com/googleapis/gax-nodejs/issues/939)) ([fc3099b](https://www.github.com/googleapis/gax-nodejs/commit/fc3099b9e6e4b53c762e9eb998a695e8f39331ca))
* set callOptions.retry properties separately ([#929](https://www.github.com/googleapis/gax-nodejs/issues/929)) ([bd0e8d2](https://www.github.com/googleapis/gax-nodejs/commit/bd0e8d246abe22cb0b3ce87fe54c3ea067e7b1eb))


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ~1.2.0 ([#934](https://www.github.com/googleapis/gax-nodejs/issues/934)) ([1bda824](https://www.github.com/googleapis/gax-nodejs/commit/1bda8240d634907d67c4e9d318576f2296cb5ca9))

### [2.9.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.9.1...v2.9.2) (2020-11-05)


### Bug Fixes

* **deps:** use google-auth-library with defaultScopes ([#931](https://www.github.com/googleapis/gax-nodejs/issues/931)) ([912b399](https://www.github.com/googleapis/gax-nodejs/commit/912b3997ead0ee048612b25101eee1d0976f62d2))

### [2.9.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.9.0...v2.9.1) (2020-10-23)


### Bug Fixes

* properly bundle requests with snake_case ([#921](https://www.github.com/googleapis/gax-nodejs/issues/921)) ([279fb36](https://www.github.com/googleapis/gax-nodejs/commit/279fb369447eca178df39f115f34f69544746ec0))

## [2.9.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.8.0...v2.9.0) (2020-09-24)


### Features

* use timeout for idempotent API calls ([#912](https://www.github.com/googleapis/gax-nodejs/issues/912)) ([414e9ad](https://www.github.com/googleapis/gax-nodejs/commit/414e9ad10dcecfef09f88315553d80792d6d75c0)), closes [#896](https://www.github.com/googleapis/gax-nodejs/issues/896)


### Bug Fixes

* allow callOptions.retry settings with grpc streaming calls ([#901](https://www.github.com/googleapis/gax-nodejs/issues/901)) ([533de29](https://www.github.com/googleapis/gax-nodejs/commit/533de2990b6f84edb83b6168e6ea4c8afefd65ab)), closes [/github.com/googleapis/gax-nodejs/blob/73b9d0d06fc24fdd11e5a408a396c082df57d177/src/streamingCalls/streaming.ts#L119](https://www.github.com/googleapis//github.com/googleapis/gax-nodejs/blob/73b9d0d06fc24fdd11e5a408a396c082df57d177/src/streamingCalls/streaming.ts/issues/L119) [/github.com/googleapis/gax-nodejs/blob/main/src/createApiCall.ts#L88](https://www.github.com/googleapis//github.com/googleapis/gax-nodejs/blob/main/src/createApiCall.ts/issues/L88)
* **deps:** bump node-fetch ([#900](https://www.github.com/googleapis/gax-nodejs/issues/900)) ([eacd382](https://www.github.com/googleapis/gax-nodejs/commit/eacd3821cece6bf354f069a78c6439b8b417b813))
* **deps:** drop semver dependency ([#907](https://www.github.com/googleapis/gax-nodejs/issues/907)) ([527b85a](https://www.github.com/googleapis/gax-nodejs/commit/527b85af73b822298e4d74849ab5dead3a15bf1a))
* **deps:** update dependency duplexify to v4 ([#910](https://www.github.com/googleapis/gax-nodejs/issues/910)) ([4c6b862](https://www.github.com/googleapis/gax-nodejs/commit/4c6b862fc18079e9741012eef2335fc5902739f9))
* drop dependencies on lodash ([#903](https://www.github.com/googleapis/gax-nodejs/issues/903)) ([96bf499](https://www.github.com/googleapis/gax-nodejs/commit/96bf499f86c3f873912739caa0fd8612800c5287))
* use timeout for idempotent API calls ([#896](https://www.github.com/googleapis/gax-nodejs/issues/896)) ([9e57fd9](https://www.github.com/googleapis/gax-nodejs/commit/9e57fd9a2124a5b37611c0b87895ad147ff047d6))

## [2.8.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.7.0...v2.8.0) (2020-09-02)


### Features

* emit 'response' with every page ([#887](https://www.github.com/googleapis/gax-nodejs/issues/887)) ([9c7f983](https://www.github.com/googleapis/gax-nodejs/commit/9c7f98336edd75b6b5ce954b093d449d40def290)), closes [/github.com/googleapis/googleapis/blob/94fe3637559a257634d7b47a15bb8d976daff788/google/bigtable/admin/v2/bigtable_instance_admin.proto#L541](https://www.github.com/googleapis//github.com/googleapis/googleapis/blob/94fe3637559a257634d7b47a15bb8d976daff788/google/bigtable/admin/v2/bigtable_instance_admin.proto/issues/L541) [/github.com/googleapis/gax-nodejs/blob/eb7aa446dabf420d65831cd151b8b3076e087c71/src/paginationCalls/pageDescriptor.ts#L63](https://www.github.com/googleapis//github.com/googleapis/gax-nodejs/blob/eb7aa446dabf420d65831cd151b8b3076e087c71/src/paginationCalls/pageDescriptor.ts/issues/L63)

## [2.7.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.6.3...v2.7.0) (2020-07-24)


### Features

* add retryRequestOptions to call settings ([#879](https://www.github.com/googleapis/gax-nodejs/issues/879)) ([aa5487b](https://www.github.com/googleapis/gax-nodejs/commit/aa5487b97f0346d0e4c3e67f0c1aedea2f128de5))
* no protobuf dependency in generated js, d.ts ([#868](https://www.github.com/googleapis/gax-nodejs/issues/868)) ([d0b7680](https://www.github.com/googleapis/gax-nodejs/commit/d0b7680bc67d484bb8389808ddff238ef6598c69))
* properly decode error in fallback scenario, export FallbackServiceError type ([#866](https://www.github.com/googleapis/gax-nodejs/issues/866)) ([af15e53](https://www.github.com/googleapis/gax-nodejs/commit/af15e5367211a9c4df9584158fd91f8efab562ee))

### [2.6.3](https://www.github.com/googleapis/gax-nodejs/compare/v2.6.2...v2.6.3) (2020-07-09)


### Bug Fixes

* typeo in nodejs .gitattribute ([#864](https://www.github.com/googleapis/gax-nodejs/issues/864)) ([6ae74a9](https://www.github.com/googleapis/gax-nodejs/commit/6ae74a94a6e5b6726459e436783e64bcdd287469))

### [2.6.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.6.1...v2.6.2) (2020-07-06)


### Bug Fixes

* **deps:** use @grpc/grpc-js ~1.1.1 ([#856](https://www.github.com/googleapis/gax-nodejs/issues/856)) ([c7daddd](https://www.github.com/googleapis/gax-nodejs/commit/c7daddde765b1489065088569bf8a4fd1b228e9a))

### [2.6.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.6.0...v2.6.1) (2020-06-08)


### Bug Fixes

* segment in path template can contain wildcard ([#849](https://www.github.com/googleapis/gax-nodejs/issues/849)) ([225be6e](https://www.github.com/googleapis/gax-nodejs/commit/225be6e8832c89f7bcb6156e6d2bf2e0e20a9f81))

## [2.6.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.5.0...v2.6.0) (2020-06-04)


### Features

* more information for exceed timeout error ([#839](https://www.github.com/googleapis/gax-nodejs/issues/839)) ([c401b80](https://www.github.com/googleapis/gax-nodejs/commit/c401b80bf83752cf1c9755e6e8ce5eea70f698d0))


### Bug Fixes

* remove version from protobuf unique root name ([#846](https://www.github.com/googleapis/gax-nodejs/issues/846)) ([9a73bf9](https://www.github.com/googleapis/gax-nodejs/commit/9a73bf933c64df03d74e6799134d3645f8345682))
* set default values for gRPC parameters ([#840](https://www.github.com/googleapis/gax-nodejs/issues/840)) ([f7ebfb6](https://www.github.com/googleapis/gax-nodejs/commit/f7ebfb6fb3f7f1707debc7274f0af57382107ebc))

## [2.5.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.4.1...v2.5.0) (2020-06-02)


### Features

* support proto3 optional fields in exported protos ([#841](https://www.github.com/googleapis/gax-nodejs/issues/841)) ([1e43774](https://www.github.com/googleapis/gax-nodejs/commit/1e43774869525e9195a94627231bd81da0859e4a))

### [2.4.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.4.0...v2.4.1) (2020-05-28)


### Bug Fixes

* fix match logic for path template ([#834](https://www.github.com/googleapis/gax-nodejs/issues/834)) ([d0d5782](https://www.github.com/googleapis/gax-nodejs/commit/d0d5782dd6172786cd9f4826034ca573a5642a9a))

## [2.4.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.3.1...v2.4.0) (2020-05-21)


### Features

* parse path template using regexes ([#823](https://www.github.com/googleapis/gax-nodejs/issues/823)) ([392a392](https://www.github.com/googleapis/gax-nodejs/commit/392a3920df6d78981ac43741f15048c84102b046))
* support non-slash resource in path template ([#833](https://www.github.com/googleapis/gax-nodejs/issues/833)) ([76696fc](https://www.github.com/googleapis/gax-nodejs/commit/76696fc48c8a5e21c3c1cde56822b7a37585e41c))


### Bug Fixes

* new typescript, strict types ([#824](https://www.github.com/googleapis/gax-nodejs/issues/824)) ([90034ce](https://www.github.com/googleapis/gax-nodejs/commit/90034ce6a8c9b635942fedb23345105264979416))
* typescript 3.9.3 compilation ([#831](https://www.github.com/googleapis/gax-nodejs/issues/831)) ([d53e169](https://www.github.com/googleapis/gax-nodejs/commit/d53e16988aa0fa260c91f84e6fc0ceae2fdecc26))

### [2.3.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.3.1-beta.0...v2.3.1) (2020-04-24)


### Bug Fixes

* do not pass undefined as option values ([#817](https://www.github.com/googleapis/gax-nodejs/issues/817)) ([dc1cda5](https://www.github.com/googleapis/gax-nodejs/commit/dc1cda560af1debe110203cb88dcccd57e296338))
* return operation array from getOperation method ([#816](https://www.github.com/googleapis/gax-nodejs/issues/816)) ([483ae8c](https://www.github.com/googleapis/gax-nodejs/commit/483ae8c24d4739dce1a18c6202a87653772e6aa1))

## [2.3.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.3.0-beta.0...v2.3.0) (2020-04-23)


### Features

* export fallback from fallback (circular) ([#803](https://www.github.com/googleapis/gax-nodejs/issues/803)) ([caefab0](https://www.github.com/googleapis/gax-nodejs/commit/caefab0a03ce4e000e55df0cc9495df92632085c))


### Bug Fixes

* add an internal getOperation method in operation client ([#812](https://www.github.com/googleapis/gax-nodejs/issues/812)) ([cc99de0](https://www.github.com/googleapis/gax-nodejs/commit/cc99de0e9d9b29ad622432470d2d293e446ff07b))

## [2.2.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.1.0...v2.2.0) (2020-04-13)


### Features

* export GRPC ([#789](https://www.github.com/googleapis/gax-nodejs/issues/789)) ([3f8c6f7](https://www.github.com/googleapis/gax-nodejs/commit/3f8c6f7b1ee22511ad651e45a591eb7be169106d))


### Bug Fixes

* **types:** use grpc call credentials type ([#790](https://www.github.com/googleapis/gax-nodejs/issues/790)) ([a11d90e](https://www.github.com/googleapis/gax-nodejs/commit/a11d90e578e661a02a5199b3864f7252bf440d62))

## [2.1.0](https://www.github.com/googleapis/gax-nodejs/compare/v2.0.2...v2.1.0) (2020-04-10)


### Features

* support Iam_service in Gax ([#762](https://www.github.com/googleapis/gax-nodejs/issues/762)) ([a4c0dd3](https://www.github.com/googleapis/gax-nodejs/commit/a4c0dd38f2cb8bff27b0bbcaaa5e0643044ea8ac))


### Bug Fixes

* apache license URL ([#468](https://www.github.com/googleapis/gax-nodejs/issues/468)) ([#779](https://www.github.com/googleapis/gax-nodejs/issues/779)) ([827a703](https://www.github.com/googleapis/gax-nodejs/commit/827a70397e855e9404a95f795358bf819c200317))

### [2.0.2](https://www.github.com/googleapis/gax-nodejs/compare/v2.0.1...v2.0.2) (2020-04-02)


### Bug Fixes

* make sure generated protos.js have unique root name ([#774](https://www.github.com/googleapis/gax-nodejs/issues/774)) ([886a6f3](https://www.github.com/googleapis/gax-nodejs/commit/886a6f388b683166e7378ad2000990b321397974))



### [2.0.1](https://www.github.com/googleapis/gax-nodejs/compare/v2.0.0...v2.0.1) (2020-03-28)


### Bug Fixes

* **deps:** update dependency google-auth-library to v6 ([#763](https://www.github.com/googleapis/gax-nodejs/issues/763)) ([72114db](https://www.github.com/googleapis/gax-nodejs/commit/72114db1b15af3034c51a784e3fc619e2ee281e5))
* make async iteration work for gRPC-fallback; refactor the code ([#765](https://www.github.com/googleapis/gax-nodejs/issues/765)) ([944c06b](https://www.github.com/googleapis/gax-nodejs/commit/944c06b4225c4dd5cdcf08e4ca2497cfe3a69cde))

## [2.0.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.14.2...v2.0.0) (2020-03-26)


### ⚠ BREAKING CHANGES

* use Node.js v10+
* throw for versions of Node.js older than v10.0.0 (#748)
* stop accepting Promise constructor (#737)

### Features

* export bundle descriptor in descriptors interface ([#744](https://www.github.com/googleapis/gax-nodejs/issues/744)) ([b1eccf9](https://www.github.com/googleapis/gax-nodejs/commit/b1eccf96c439d67376d249a54c9d22ffe7ff1839))
* export ServiceError from @grpc/grpc-js ([#754](https://www.github.com/googleapis/gax-nodejs/issues/754)) ([24a4d60](https://www.github.com/googleapis/gax-nodejs/commit/24a4d600738a9597e9a87d6705eaed3dc2285e3b))
* stop accepting Promise constructor ([#737](https://www.github.com/googleapis/gax-nodejs/issues/737)) ([816bf9b](https://www.github.com/googleapis/gax-nodejs/commit/816bf9b283217208debd979e893a6daf29f1f739))
* support async iterator for paging method ([#708](https://www.github.com/googleapis/gax-nodejs/issues/708)) ([3ac5afb](https://www.github.com/googleapis/gax-nodejs/commit/3ac5afb3b1b1b22798f15ee07395f3ca765383b4))
* throw for versions of Node.js older than v10.0.0 ([#748](https://www.github.com/googleapis/gax-nodejs/issues/748)) ([511fc23](https://www.github.com/googleapis/gax-nodejs/commit/511fc233bd66d537c24743ef460ee8c609cd551f))


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ^0.7.0 ([#736](https://www.github.com/googleapis/gax-nodejs/issues/736)) ([01c428c](https://www.github.com/googleapis/gax-nodejs/commit/01c428cb1240320b92778abf1297a5ff72346fd9))
* **deps:** use @grpc/grpc-js v0.7.2 ([#735](https://www.github.com/googleapis/gax-nodejs/issues/735)) ([836e81b](https://www.github.com/googleapis/gax-nodejs/commit/836e81b64f84d8c118e6aea0580f0645658a8490))
* **deps:** use protobuf.js v6.8.9 ([#743](https://www.github.com/googleapis/gax-nodejs/issues/743)) ([fab91ce](https://www.github.com/googleapis/gax-nodejs/commit/fab91ce334d76212d7e31b5478331339c5acad76))
* allow passing numbers as path template parameters ([#756](https://www.github.com/googleapis/gax-nodejs/issues/756)) ([c466d3d](https://www.github.com/googleapis/gax-nodejs/commit/c466d3dc68c8f9050d3ae69dcedd708e3509ae17))


### Miscellaneous Chores

* require Node.js v10+ ([#759](https://www.github.com/googleapis/gax-nodejs/issues/759)) ([23ec7f6](https://www.github.com/googleapis/gax-nodejs/commit/23ec7f69c3813f6d06ea8b2a473d072337e1b499))

### [1.14.2](https://www.github.com/googleapis/gax-nodejs/compare/v1.14.1...v1.14.2) (2020-02-27)


### Bug Fixes

* **deps:** update @grpc/grpc-js see: [#728](https://www.github.com/googleapis/gax-nodejs/issues/728) ([#730](https://www.github.com/googleapis/gax-nodejs/issues/730)) ([b08a316](https://www.github.com/googleapis/gax-nodejs/commit/b08a316ec74654c07907d2f350df152fcf612c4a))

### [1.14.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.14.0...v1.14.1) (2020-01-28)


### Bug Fixes

* properly parse special field names in compileProtos ([#716](https://www.github.com/googleapis/gax-nodejs/issues/716)) ([e195df7](https://www.github.com/googleapis/gax-nodejs/commit/e195df7a89a5c1de72c41bf84f8c1bcf7a8f17c8))

## [1.14.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.13.0...v1.14.0) (2020-01-27)


### Features

* allow strings for enums, bytes, and Long in .d.ts ([#714](https://www.github.com/googleapis/gax-nodejs/issues/714)) ([154d771](https://www.github.com/googleapis/gax-nodejs/commit/154d771c8dcd16572d3862127b1b7863f75eb39a))
* some basic samples, plus two new exports ([#702](https://www.github.com/googleapis/gax-nodejs/issues/702)) ([1204e2e](https://www.github.com/googleapis/gax-nodejs/commit/1204e2e28d6c24786c38deb57efd859536d168bc))


### Bug Fixes

* **deps:** use semver v6, mkdirp v0.5.1 to keep supporting node8 for a while ([#707](https://www.github.com/googleapis/gax-nodejs/issues/707)) ([d257dc9](https://www.github.com/googleapis/gax-nodejs/commit/d257dc98a66ec6fe3850a32efe04c3a0c5bb18a8))

## [1.13.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.12.0...v1.13.0) (2020-01-02)


### Features

* export GRPC error code enum ([#693](https://www.github.com/googleapis/gax-nodejs/issues/693)) ([8215535](https://www.github.com/googleapis/gax-nodejs/commit/8215535faf0ed84889f0aac3b898646515a5aeb7))
* export ServiceConfig ([#695](https://www.github.com/googleapis/gax-nodejs/issues/695)) ([198101a](https://www.github.com/googleapis/gax-nodejs/commit/198101a292c829e31763aa566e9b351a1548d5ed))


### Bug Fixes

* fix possible invalid retry variables ([#682](https://www.github.com/googleapis/gax-nodejs/issues/682)) ([2cb343c](https://www.github.com/googleapis/gax-nodejs/commit/2cb343c99735059bc626231cd91b7d0cbb5c0042))
* **deps:** update dependency semver to v7 ([#683](https://www.github.com/googleapis/gax-nodejs/issues/683)) ([b28e6b1](https://www.github.com/googleapis/gax-nodejs/commit/b28e6b13337cd4033a52bba428e9f67bd64b8ff4))
* **types:** enable noImplicitAny in tsconfig ([#679](https://www.github.com/googleapis/gax-nodejs/issues/679)) ([6ecdeb7](https://www.github.com/googleapis/gax-nodejs/commit/6ecdeb77c399d04f27a9551933c3b12f5c0c003c))

## [1.12.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.11.2...v1.12.0) (2019-12-09)


### Features

* export OperationsClient ([#677](https://www.github.com/googleapis/gax-nodejs/issues/677)) ([66425fa](https://www.github.com/googleapis/gax-nodejs/commit/66425fa4ff75ae142fd972de21b92a4e22c9a8d7))


### Bug Fixes

* servicePath and port may be undefined ([#668](https://www.github.com/googleapis/gax-nodejs/issues/668)) ([10eaaa6](https://www.github.com/googleapis/gax-nodejs/commit/10eaaa695fde3bd272dd9995c6c8c6287ad45929))
* **deps:** pin TypeScript below 3.7.0 ([70dd3b7](https://www.github.com/googleapis/gax-nodejs/commit/70dd3b7a876f50c3a7bf503ddc6190a5b82e5285))

### [1.11.2](https://www.github.com/googleapis/gax-nodejs/compare/v1.11.1...v1.11.2) (2019-11-22)


### Bug Fixes

* **deps:** unpin @grpc/grpc-js, set it to ^0.6.12 ([#665](https://www.github.com/googleapis/gax-nodejs/issues/665)) ([265461e](https://www.github.com/googleapis/gax-nodejs/commit/265461e7573c9bbd650eb0558313c05330691717))

* servicePath and port may be undefined ([#668](https://github.com/googleapis/gax-nodejs/pull/668))
([54fa7b9](https://www.github.com/googleapis/gax-nodejs/commit/54fa7b96915852255f511bddc575177c3cabb3ac))

### [1.11.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.11.0...v1.11.1) (2019-11-15)


### Bug Fixes

* **deps:** use typescript ~3.6.0 ([#662](https://www.github.com/googleapis/gax-nodejs/issues/662)) ([2a4f255](https://www.github.com/googleapis/gax-nodejs/commit/2a4f255b0d0ea58488485465c48f248b153f1cf9))

## [1.11.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.10.0...v1.11.0) (2019-11-14)


### Features

* export types for paginated calls ([#657](https://www.github.com/googleapis/gax-nodejs/issues/657)) ([b4007c7](https://www.github.com/googleapis/gax-nodejs/commit/b4007c70550517c90b43698674a57645c73111dc))


### Bug Fixes

* add license to protos/protos.js ([#655](https://www.github.com/googleapis/gax-nodejs/issues/655)) ([e7071d1](https://www.github.com/googleapis/gax-nodejs/commit/e7071d198618ebe278cddea0f8d3f02a806ba040))

## [1.10.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.9.1...v1.10.0) (2019-11-12)


### Features

* export APICallback type ([#653](https://www.github.com/googleapis/gax-nodejs/issues/653)) ([e814cc1](https://www.github.com/googleapis/gax-nodejs/commit/e814cc194437ef2b283d24fffae99d33f7397547))


### Bug Fixes

* **docs:** add jsdoc-region-tag plugin ([#651](https://www.github.com/googleapis/gax-nodejs/issues/651)) ([6a6e7e6](https://www.github.com/googleapis/gax-nodejs/commit/6a6e7e654d57a96433165203d8bf92485eaa9872))

### [1.9.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.9.0...v1.9.1) (2019-11-11)


### Bug Fixes

* add Apache license to the generated protos.d.ts file ([#649](https://www.github.com/googleapis/gax-nodejs/issues/649)) ([3ce2856](https://www.github.com/googleapis/gax-nodejs/commit/3ce2856346789ed333f667caaf0f4c73b36e8082))

## [1.9.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.8.0...v1.9.0) (2019-11-09)


### Features

* move micro-gen common interface to gax ([#646](https://www.github.com/googleapis/gax-nodejs/issues/646)) ([b93f9c1](https://www.github.com/googleapis/gax-nodejs/commit/b93f9c106faecce337ef22c5864a9f2d45c80775))


### Bug Fixes

* add long to protos.d.ts ([#643](https://www.github.com/googleapis/gax-nodejs/issues/643)) ([e1012fa](https://www.github.com/googleapis/gax-nodejs/commit/e1012fa6ffaae35a9556b7e431cd504c1f96f8f5))
* depend on @types/long ([#645](https://www.github.com/googleapis/gax-nodejs/issues/645)) ([235744e](https://www.github.com/googleapis/gax-nodejs/commit/235744e126c3fa65f5e5b8e36d874d9142fcbfaa))

## [1.8.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.7.5...v1.8.0) (2019-11-08)


### Features

* export GaxCall in apiTypes ([c451c32](https://www.github.com/googleapis/gax-nodejs/commit/c451c3234c53b1e4d362c5988c4b781e1013dc52))


### Bug Fixes

* correct array comparison ([#628](https://www.github.com/googleapis/gax-nodejs/issues/628)) ([c73e2fd](https://www.github.com/googleapis/gax-nodejs/commit/c73e2fd22427a7ce2fe16063251a1f1d84ec61f9))
* **deps:** bump google-gax to 1.7.5 ([#630](https://www.github.com/googleapis/gax-nodejs/issues/630)) ([7428a26](https://www.github.com/googleapis/gax-nodejs/commit/7428a26aad0512fff68213f7cdd20eca798266e7))

### [1.7.5](https://www.github.com/googleapis/gax-nodejs/compare/v1.7.4...v1.7.5) (2019-10-14)


### Bug Fixes

* **deps:** update @grpc/grpc-js to v0.6.9 ([#624](https://www.github.com/googleapis/gax-nodejs/issues/624)) ([138ba85](https://www.github.com/googleapis/gax-nodejs/commit/138ba85f8fe385ed52d2bb4cb66d80162b2ab630))

### [1.7.4](https://www.github.com/googleapis/gax-nodejs/compare/v1.7.3...v1.7.4) (2019-10-10)


### Bug Fixes

* **deps:** pin @grpc/grpc-js to v0.6.8 ([#621](https://www.github.com/googleapis/gax-nodejs/issues/621)) ([9ba872a](https://www.github.com/googleapis/gax-nodejs/commit/9ba872ad006b259ff799337ceb50fde73c756239))

### [1.7.3](https://www.github.com/googleapis/gax-nodejs/compare/v1.7.2...v1.7.3) (2019-10-10)


### Bug Fixes

* fix a type of AnyDecoder ([#619](https://www.github.com/googleapis/gax-nodejs/issues/619)) ([ed46692](https://www.github.com/googleapis/gax-nodejs/commit/ed46692))

### [1.7.2](https://www.github.com/googleapis/gax-nodejs/compare/v1.7.1...v1.7.2) (2019-10-09)


### Bug Fixes

* clientConfig can be omitted ([#617](https://www.github.com/googleapis/gax-nodejs/issues/617)) ([b4d7e8c](https://www.github.com/googleapis/gax-nodejs/commit/b4d7e8c))

### [1.7.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.7.0...v1.7.1) (2019-10-09)


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to v0.6.7 ([#615](https://www.github.com/googleapis/gax-nodejs/issues/615)) ([7af35bc](https://www.github.com/googleapis/gax-nodejs/commit/7af35bc))

## [1.7.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.6.4...v1.7.0) (2019-10-09)


### Features

* export CancellableStream ([#610](https://www.github.com/googleapis/gax-nodejs/issues/610)) ([847270b](https://www.github.com/googleapis/gax-nodejs/commit/847270b))

### [1.6.4](https://www.github.com/googleapis/gax-nodejs/compare/v1.6.3...v1.6.4) (2019-10-03)


### Bug Fixes

* **deps:** use @grpc/grpc-js v0.6.4 ([#605](https://www.github.com/googleapis/gax-nodejs/issues/605)) ([628db9e](https://www.github.com/googleapis/gax-nodejs/commit/628db9e))

### [1.6.3](https://www.github.com/googleapis/gax-nodejs/compare/v1.6.2...v1.6.3) (2019-10-02)


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ^0.6.3 ([#594](https://www.github.com/googleapis/gax-nodejs/issues/594)) ([8c5c105](https://www.github.com/googleapis/gax-nodejs/commit/8c5c105))

### [1.6.2](https://www.github.com/googleapis/gax-nodejs/compare/v1.6.1...v1.6.2) (2019-09-27)


### Bug Fixes

* x-goog-api-client header for fallback ([#592](https://www.github.com/googleapis/gax-nodejs/issues/592)) ([4425a54](https://www.github.com/googleapis/gax-nodejs/commit/4425a54))

### [1.6.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.6.0...v1.6.1) (2019-09-20)


### Bug Fixes

* make fallback version unique ([#590](https://www.github.com/googleapis/gax-nodejs/issues/590)) ([2586baa](https://www.github.com/googleapis/gax-nodejs/commit/2586baa))

## [1.6.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.5.2...v1.6.0) (2019-09-19)


### Features

* make compileProtos generate TypeScript types ([#588](https://www.github.com/googleapis/gax-nodejs/issues/588)) ([1dd8b47](https://www.github.com/googleapis/gax-nodejs/commit/1dd8b47))

### [1.5.2](https://www.github.com/googleapis/gax-nodejs/compare/v1.5.1...v1.5.2) (2019-09-05)


### Bug Fixes

* properly handle gRPC-fallback errors ([#582](https://www.github.com/googleapis/gax-nodejs/issues/582)) ([76f1c5b](https://www.github.com/googleapis/gax-nodejs/commit/76f1c5b))

### [1.5.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.5.0...v1.5.1) (2019-08-28)


### Bug Fixes

* export version from fallback ([#579](https://www.github.com/googleapis/gax-nodejs/issues/579)) ([ecc2516](https://www.github.com/googleapis/gax-nodejs/commit/ecc2516))

## [1.5.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.4.0...v1.5.0) (2019-08-28)


### Features

* export call types ([#576](https://www.github.com/googleapis/gax-nodejs/issues/576)) ([74aa605](https://www.github.com/googleapis/gax-nodejs/commit/74aa605))

## [1.4.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.3.0...v1.4.0) (2019-08-27)


### Features

* add AbortController for node-fetch ([#569](https://www.github.com/googleapis/gax-nodejs/issues/569)) ([92b7590](https://www.github.com/googleapis/gax-nodejs/commit/92b7590))
* support sending `x-goog-request-params` (and other extra) headers for fallback requests  ([#568](https://www.github.com/googleapis/gax-nodejs/issues/568)) ([a1e6570](https://www.github.com/googleapis/gax-nodejs/commit/a1e6570))
* use JSON proto for LRO client ([#574](https://www.github.com/googleapis/gax-nodejs/issues/574)) ([92a11c1](https://www.github.com/googleapis/gax-nodejs/commit/92a11c1))

## [1.3.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.2.1...v1.3.0) (2019-08-01)


### Features

* making `google-gax` work in browser with `webpack` ([#554](https://www.github.com/googleapis/gax-nodejs/issues/554)) ([3690ab1](https://www.github.com/googleapis/gax-nodejs/commit/3690ab1))

### [1.2.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.2.0...v1.2.1) (2019-07-31)


### Bug Fixes

* compileProtos should not fail if no protos are given ([#555](https://www.github.com/googleapis/gax-nodejs/issues/555)) ([4cf8efd](https://www.github.com/googleapis/gax-nodejs/commit/4cf8efd))

## [1.2.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.1.5...v1.2.0) (2019-07-29)


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ^0.5.0 ([#548](https://www.github.com/googleapis/gax-nodejs/issues/548)) ([a431c63](https://www.github.com/googleapis/gax-nodejs/commit/a431c63))
* **deps:** update dependency google-auth-library to v5 ([#552](https://www.github.com/googleapis/gax-nodejs/issues/552)) ([9c98083](https://www.github.com/googleapis/gax-nodejs/commit/9c98083))


### Features

* allow to pass just one file path to loadProto ([#543](https://www.github.com/googleapis/gax-nodejs/issues/543)) ([5429ad9](https://www.github.com/googleapis/gax-nodejs/commit/5429ad9))
* compileProtos bin script ([#547](https://www.github.com/googleapis/gax-nodejs/issues/547)) ([1334c6d](https://www.github.com/googleapis/gax-nodejs/commit/1334c6d))
* reexport protobufjs from gax ([#544](https://www.github.com/googleapis/gax-nodejs/issues/544)) ([b86a2c6](https://www.github.com/googleapis/gax-nodejs/commit/b86a2c6))

### [1.1.5](https://www.github.com/googleapis/gax-nodejs/compare/v1.1.4...v1.1.5) (2019-07-13)

### Dependency upgrade

* `@grpc/grpc-js` is upgraded to `^0.5.2` to fix the invalid metadata problem (fixing [this issue](https://github.com/googleapis/nodejs-datastore/issues/415) and several duplicates).

### [1.1.4](https://www.github.com/googleapis/gax-nodejs/compare/v1.1.3...v1.1.4) (2019-07-02)


### Bug Fixes

* copy values from LRO to Operation wrapper ([#529](https://www.github.com/googleapis/gax-nodejs/issues/529)) ([7dfe2cd](https://www.github.com/googleapis/gax-nodejs/commit/7dfe2cd))

### [1.1.3](https://www.github.com/googleapis/gax-nodejs/compare/v1.1.2...v1.1.3) (2019-06-26)


### Bug Fixes

* **docs:** make anchors work in jsdoc ([#523](https://www.github.com/googleapis/gax-nodejs/issues/523)) ([81bca11](https://www.github.com/googleapis/gax-nodejs/commit/81bca11))

### [1.1.2](https://www.github.com/googleapis/gax-nodejs/compare/v1.1.1...v1.1.2) (2019-06-20)


### Bug Fixes

* routing header parameters must be urlencoded ([#521](https://www.github.com/googleapis/gax-nodejs/issues/521)) ([4ade536](https://www.github.com/googleapis/gax-nodejs/commit/4ade536))

### [1.1.1](https://www.github.com/googleapis/gax-nodejs/compare/v1.1.0...v1.1.1) (2019-05-17)


### Bug Fixes

* use latest proto-loader with fixed types ([#508](https://www.github.com/googleapis/gax-nodejs/issues/508)) ([1afee35](https://www.github.com/googleapis/gax-nodejs/commit/1afee35))

## [1.1.0](https://www.github.com/googleapis/gax-nodejs/compare/v1.0.0...v1.1.0) (2019-05-16)


### Bug Fixes

* **deps:** update dependency walkdir to ^0.4.0 ([#499](https://www.github.com/googleapis/gax-nodejs/issues/499)) ([d2e01bd](https://www.github.com/googleapis/gax-nodejs/commit/d2e01bd))
* DEADLINE_EXCEEDED retry code is idempotent ([#495](https://www.github.com/googleapis/gax-nodejs/issues/495)) ([8c59bda](https://www.github.com/googleapis/gax-nodejs/commit/8c59bda))


### Features

* allow loading multiple proto files at once ([#503](https://www.github.com/googleapis/gax-nodejs/issues/503)) ([3d192a9](https://www.github.com/googleapis/gax-nodejs/commit/3d192a9))

## [1.0.0](https://www.github.com/googleapis/gax-nodejs/compare/v0.26.0...v1.0.0) (2019-05-09)


### Bug Fixes

* **deps:** update dependency @grpc/grpc-js to ^0.4.0 ([#487](https://www.github.com/googleapis/gax-nodejs/issues/487)) ([981b1ed](https://www.github.com/googleapis/gax-nodejs/commit/981b1ed))
* **deps:** update dependency google-auth-library to v4 ([#493](https://www.github.com/googleapis/gax-nodejs/issues/493)) ([03236f4](https://www.github.com/googleapis/gax-nodejs/commit/03236f4))


### Build System

* upgrade engines field to >=8.10.0 ([#483](https://www.github.com/googleapis/gax-nodejs/issues/483)) ([728678a](https://www.github.com/googleapis/gax-nodejs/commit/728678a))


### Features

* use @grpc/grpc-js instead of grpc ([#484](https://www.github.com/googleapis/gax-nodejs/issues/484)) ([b872f2b](https://www.github.com/googleapis/gax-nodejs/commit/b872f2b))


### BREAKING CHANGES

* use @grpc/grpc-js instead of grpc (#484)
* upgrade engines field to >=8.10.0 (#483)

## v0.26.0

04-30-2019 20:45 PDT

### Implementation Changes

- refactor: a huge refactor of call handling ([#467](https://github.com/googleapis/gax-nodejs/pull/467))
- feat: do not use legacy grpc loadObject ([#477](https://github.com/googleapis/gax-nodejs/pull/477))

### New Features

- feat: turned google-proto-files into a dev dependency ([#470](https://github.com/googleapis/gax-nodejs/pull/470))

### Dependencies

- chore(deps): unpin grpc ([#475](https://github.com/googleapis/gax-nodejs/pull/475))
- fix: pin grpc 1.20.0 ([#474](https://github.com/googleapis/gax-nodejs/pull/474))
- chore(deps): update dependency nyc to v14 ([#468](https://github.com/googleapis/gax-nodejs/pull/468))
- fix(deps): update dependency @grpc/proto-loader to ^0.5.0 ([#466](https://github.com/googleapis/gax-nodejs/pull/466))
- chore(deps): update dependency mocha to ~6.1.0 ([#464](https://github.com/googleapis/gax-nodejs/pull/464))
- chore(deps): update dependency typescript to ~3.4.0
- chore(deps): update dependency @types/semver to v6

### Internal / Testing Changes

- test: end-to-end system test ([#471](https://github.com/googleapis/gax-nodejs/pull/471))
- update to .nycrc with --all enabled ([#476](https://github.com/googleapis/gax-nodejs/pull/476))
- test: better return type for typescript 3.4.0 ([#463](https://github.com/googleapis/gax-nodejs/pull/463))

## v0.25.6

03-28-2019 21:27 PDT

### Fixes
- fix(deps): update dependency semver to v6
- fix: bundling is optional in MethodConfig ([#459](https://github.com/googleapis/gax-nodejs/pull/459))
- fix(ts): drop dependency on @types/duplexify ([#458](https://github.com/googleapis/gax-nodejs/pull/458))

### Internal / Testing Changes
- chore: publish to npm using wombat ([#453](https://github.com/googleapis/gax-nodejs/pull/453))
- build: use per-repo publish token ([#449](https://github.com/googleapis/gax-nodejs/pull/449))

## v0.25.5

03-15-2019 14:01 PDT

### Implementation Changes

- fix: includes @types/duplexify in package ([#441](https://github.com/googleapis/gax-nodejs/pull/441))

### Dependencies

- fix(deps): update dependency google-proto-files to ^0.19.0
- chore(deps): update dependency @types/source-map-support to ^0.5.0 ([#442](https://github.com/googleapis/gax-nodejs/pull/442))

### Internal / Testing Changes

- build: Add docuploader credentials to node publish jobs ([#444](https://github.com/googleapis/gax-nodejs/pull/444))
- build: use node10 to run samples-test, system-test etc ([#443](https://github.com/googleapis/gax-nodejs/pull/443))
- build: update kokoro config ([#440](https://github.com/googleapis/gax-nodejs/pull/440))
- test: longer timeout for Pub/Sub system tests ([#451](https://github.com/googleapis/gax-nodejs/pull/451))

## v0.25.4

02-28-2019 17:51 PST

### Implementation Changes

- fix: do not hang in LRO forever if API returned nothing ([#436](https://github.com/googleapis/gax-nodejs/pull/436))

## v0.25.3

02-26-2019 12:08 PST

### Implementation Changes

- fix: monitoring could be a common proto ([#434](https://github.com/googleapis/gax-nodejs/pull/434))
- refactor: cleanup unused files ([#422](https://github.com/googleapis/gax-nodejs/pull/422))
- chore(typescript): export common API call types ([#433](https://github.com/googleapis/gax-nodejs/pull/433))

### Dependencies

- chore(deps): update dependency mocha to v6 ([#430](https://github.com/googleapis/gax-nodejs/pull/430))

### Documentation

- docs: update links in contrib guide ([#429](https://github.com/googleapis/gax-nodejs/pull/429))

### Internal / Testing Changes

- build: use linkinator for docs test ([#428](https://github.com/googleapis/gax-nodejs/pull/428))

## v0.25.2

02-12-2019 01:16 PST

- fix: do not fail if bundledField is missing ([#424](https://github.com/googleapis/gax-nodejs/pull/424))
- fix: do not use console.warn or console.error ([#426](https://github.com/googleapis/gax-nodejs/pull/426))

### Implementation Changes

- refactor: snake case savagery is for pythonistas 🙅‍♂️🐍 ([#421](https://github.com/googleapis/gax-nodejs/pull/421))
- refactor: clean up operations client ([#420](https://github.com/googleapis/gax-nodejs/pull/420))

### Internal / Testing Changes

- test: do not use grpc-js in regular system test ([#425](https://github.com/googleapis/gax-nodejs/pull/425))
- build: create docs test npm scripts ([#423](https://github.com/googleapis/gax-nodejs/pull/423))

## v0.25.1

02-08-2019 18:01 PST

This is a patch release that fixes the code working with `grpc-js` ([#400](https://github.com/googleapis/gax-nodejs/pull/400)).
It's not supposed to be used in production (yet), so it's hidden behind a secret environment variable.
We'll let you know when it's ready to use!

### Dependencies

- fix(deps): update dependency walkdir to v0.3.2 ([#413](https://github.com/googleapis/gax-nodejs/pull/413))
- fix(deps): update dependency walkdir to v0.2.0 ([#410](https://github.com/googleapis/gax-nodejs/pull/410))
- fix(deps): update dependency walkdir to v0.1.0 ([#407](https://github.com/googleapis/gax-nodejs/pull/407))

### Documentation

- docs: update contributing guide ([#414](https://github.com/googleapis/gax-nodejs/pull/414))
- docs: add lint/fix example to contributing guide ([#409](https://github.com/googleapis/gax-nodejs/pull/409))
- docs: fix type for retryCodes ([#404](https://github.com/googleapis/gax-nodejs/pull/404))

### Internal / Testing Changes

- build: test using @grpc/grpc-js in CI ([#418](https://github.com/googleapis/gax-nodejs/pull/418))
- chore: don't run system tests with grpc-js ([#417](https://github.com/googleapis/gax-nodejs/pull/417))
- test: enable testing of grpc-js ([#400](https://github.com/googleapis/gax-nodejs/pull/400))

## v0.25.0

01-28-2019 23:31 PST

### New Features

- Add grpc-gcp support in gax ([#396](https://github.com/googleapis/gax-nodejs/pull/396))

### Dependencies

- chore(deps): update dependency eslint-config-prettier to v4 ([#399](https://github.com/googleapis/gax-nodejs/pull/399))

## v0.24.0

01-24-2019 08:49 PST

### Dependencies
- fix(deps): update dependency @grpc/proto-loader to ^0.4.0 ([#395](https://github.com/googleapis/gax-nodejs/pull/395))
- fix(deps): update dependency google-auth-library to v3 ([#394](https://github.com/googleapis/gax-nodejs/pull/394))

## v0.23.0

01-11-2019 13:32 PST


### Implementation Changes
- fix: include status code on errors ([#390](https://github.com/googleapis/gax-nodejs/pull/390))
- fix: Change to "greater than" for limit on number of elements ([#386](https://github.com/googleapis/gax-nodejs/pull/386))
- fix(ts): export CallSettings and RetryOptions ([#360](https://github.com/googleapis/gax-nodejs/pull/360))

### Dependencies
- chore(deps): update dependency @types/sinon to v7 ([#385](https://github.com/googleapis/gax-nodejs/pull/385))
- chore(deps): update dependency typescript to ~3.2.0 ([#364](https://github.com/googleapis/gax-nodejs/pull/364))
- chore(deps): update dependency gts to ^0.9.0 ([#355](https://github.com/googleapis/gax-nodejs/pull/355))

### Documentation
- build: check broken links in generated docs ([#387](https://github.com/googleapis/gax-nodejs/pull/387))

### Internal / Testing Changes
- chore(build): inject yoshi automation key ([#384](https://github.com/googleapis/gax-nodejs/pull/384))
- chore: update nyc and eslint configs ([#383](https://github.com/googleapis/gax-nodejs/pull/383))
- chore: npm-install-retry is not a thing anymore ([#381](https://github.com/googleapis/gax-nodejs/pull/381))
- chore: fix publish.sh permission +x ([#380](https://github.com/googleapis/gax-nodejs/pull/380))
- fix(build): fix Kokoro release script ([#379](https://github.com/googleapis/gax-nodejs/pull/379))
- build: add Kokoro configs for autorelease ([#378](https://github.com/googleapis/gax-nodejs/pull/378))
- chore: always nyc report before calling codecov ([#375](https://github.com/googleapis/gax-nodejs/pull/375))
- chore: nyc ignore build/test by default ([#374](https://github.com/googleapis/gax-nodejs/pull/374))
- chore: update synth metadata ([#372](https://github.com/googleapis/gax-nodejs/pull/372))
- chore: fix openssl decrypt ([#367](https://github.com/googleapis/gax-nodejs/pull/367))
- test: enable pub/sub system tests ([#366](https://github.com/googleapis/gax-nodejs/pull/366))
- chore: don't say operations_client.ts is autogen'd ([#361](https://github.com/googleapis/gax-nodejs/pull/361))
- test: don't run Pub/Sub system tests ([#362](https://github.com/googleapis/gax-nodejs/pull/362))
- chore: include format and lint tools for samples ([#359](https://github.com/googleapis/gax-nodejs/pull/359))
- chore: add a synth.metadata

## v0.22.1

11-12-2018 16:56 PST


### Dependencies
- Update grpc dependency ([#353](https://github.com/googleapis/gax-nodejs/pull/353))

### Internal / Testing Changes
- Update eslintignore config ([#352](https://github.com/googleapis/gax-nodejs/pull/352))

## v0.22.0

11-12-2018 15:05 PST

### New Features
- feat: to support GRPC-GCP Extension, include additional options in grpcOptions ([#328](https://github.com/googleapis/gax-nodejs/pull/328))

## v0.21.0

### 11-10-2018 11:27 PST
This is a minor service release that largely contains updates to other modules.  The upgrade to `google-proto-files` and `walkdir` in particular should improve load time of the module by at least ~100ms.

### Dependencies
- fix(deps): update dependency google-proto-files to ^0.18.0 ([#348](https://github.com/googleapis/gax-nodejs/pull/348))
- fix: use `walkdir` instead of `globby` ([#346](https://github.com/googleapis/gax-nodejs/pull/346))
- chore(deps): update dependency through2 to v3 ([#343](https://github.com/googleapis/gax-nodejs/pull/343))
- chore: update grpc to ^1.15.1 ([#316](https://github.com/googleapis/gax-nodejs/pull/316))
- fix(deps): update dependency @grpc/grpc-js to ^0.3.0 ([#308](https://github.com/googleapis/gax-nodejs/pull/308))

### Internal / Testing Changes
- fix: improve types, remove dead code ([#340](https://github.com/googleapis/gax-nodejs/pull/340))
- refactor: enable noImplicitThis in the tsconfig ([#347](https://github.com/googleapis/gax-nodejs/pull/347))
- refactor: drop extend and lodash.flatten ([#345](https://github.com/googleapis/gax-nodejs/pull/345))
- chore: remove temporary folder ([#339](https://github.com/googleapis/gax-nodejs/pull/339))
- chore: use latest npm on Windows ([#344](https://github.com/googleapis/gax-nodejs/pull/344))
- refactor: clean up lodash and use strict ([#342](https://github.com/googleapis/gax-nodejs/pull/342))
- chore: include build in eslintignore ([#337](https://github.com/googleapis/gax-nodejs/pull/337))
- chore: system tests for gax ([#334](https://github.com/googleapis/gax-nodejs/pull/334))
- chore: update issue templates ([#333](https://github.com/googleapis/gax-nodejs/pull/333))
- Update issue templates
- chore: remove old issue template ([#329](https://github.com/googleapis/gax-nodejs/pull/329))
- build: run tests on node11 ([#327](https://github.com/googleapis/gax-nodejs/pull/327))
- fix: better types for GAPIC clients ([#326](https://github.com/googleapis/gax-nodejs/pull/326))
- chores(build): do not collect sponge.xml from windows builds ([#325](https://github.com/googleapis/gax-nodejs/pull/325))
- chores(build): run codecov on continuous builds ([#324](https://github.com/googleapis/gax-nodejs/pull/324))
- chore: update new issue template ([#323](https://github.com/googleapis/gax-nodejs/pull/323))
- build: fix codecov uploading on Kokoro ([#320](https://github.com/googleapis/gax-nodejs/pull/320))
- fix(deps): update dependency google-proto-files to ^0.17.0 ([#317](https://github.com/googleapis/gax-nodejs/pull/317))
- chore(deps): update dependency sinon to v7 ([#319](https://github.com/googleapis/gax-nodejs/pull/319))
- Update kokoro config ([#315](https://github.com/googleapis/gax-nodejs/pull/315))
- chore(deps): update dependency typescript to ~3.1.0 ([#313](https://github.com/googleapis/gax-nodejs/pull/313))
- Update CI config ([#312](https://github.com/googleapis/gax-nodejs/pull/312))
- build: prevent system/sample-test from leaking credentials
- Update the kokoro config ([#309](https://github.com/googleapis/gax-nodejs/pull/309))
- test: remove appveyor config ([#307](https://github.com/googleapis/gax-nodejs/pull/307))
- Update CI config ([#306](https://github.com/googleapis/gax-nodejs/pull/306))
- Enable prefer-const in the eslint config ([#304](https://github.com/googleapis/gax-nodejs/pull/304))
- Enable no-var in eslint ([#303](https://github.com/googleapis/gax-nodejs/pull/303))

## v0.18.0

### Implementation Changes
BREAKING CHANGE:
- fix: drop support for node.js 4.x and 9.x (#262)

### New Features

### Dependencies
- refactor: add dependency on @grpc/proto-loader (#229)
- chore(deps): update dependency typescript to v3 (#275)
- fix(deps): update dependency @grpc/proto-loader to ^0.3.0 (#269)
- chore(deps): update dependency gts to ^0.8.0 (#266)
- chore(package): Update gts to the latest version 🚀 (#255)
- chore(package): update @types/globby to version 8.0.0 (#257)

### Documentation
- Add Code of Conduct

### Internal / Testing Changes
- chore: move mocha options to mocha.opts (#274)
- test: fixing timeouts (#264)
- Configure Renovate (#258)
- fix: fix typo in a test (#260)
- fix: update linking for samples (#259)
- refactor: remove prettier, eslint, jshint (#254)
