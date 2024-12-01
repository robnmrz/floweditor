import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any; // besides fixed keys this means object can be extended with other keys
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (value: string) => void;
  disabled?: boolean;
}

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
