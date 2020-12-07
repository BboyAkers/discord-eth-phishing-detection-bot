type AnyFn = (...args:any[]) => any

type Uints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
type LoopIndex = [-1, ...Uints];

type TupleOf<Value, Length extends LoopIndex[number]> = Length extends 0 | -1
  ? []
  : [Value, ...TupleOf<Value, LoopIndex[Length]>];

type InputFunctionArg<Input> = readonly [(arg: Input) => any, ...AnyFn[]];
type OutputFunctionReturn<Output> = readonly [
  ...TupleOf<AnyFn, LoopIndex[number]>,
  (...args: any[]) => Output
];

type PipeInput<Input, Output> = InputFunctionArg<Input> & OutputFunctionReturn<Output>;


declare module "eth-phishing-detect" {
  export default function (url: string): boolean
}

declare module "@emnudge/domyno/pipeable" {
  export const map: <T,U>(callback:(item:T,index:number) => U)=> (iter: Iterable<T>) => IterableIterator<U>
  export const filter: <T>(callback:(item:T,index:number) => unknown)=> (iter: Iterable<T>) => IterableIterator<T>
  export const some: <T>(callback:(item:T,index:number) => unknown)=> (iter: Iterable<T>) => boolean
}

declare module "@emnudge/domyno" {
  export const pipe: <Input,Output>(...args: PipeInput<Input,Output>) => (input: Input) => Output
}

declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
          SERVER_ID: string,
          ADMIN_CHANNEL_ID: string,
      }
    }
  }
  
}