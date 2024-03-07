/// <reference types="node" />
import * as protobuf from 'protobufjs';
import { JSONObject, JSONValue } from './types';
export interface Any {
    type_url: string;
    value: Buffer | Uint8Array;
}
export declare function googleProtobufAnyToProto3JSON(obj: protobuf.Message & Any): JSONObject;
export declare function googleProtobufAnyFromProto3JSON(root: protobuf.Root, json: JSONValue): {
    type_url: string;
    value: null;
} | {
    type_url: string;
    value: string;
};
