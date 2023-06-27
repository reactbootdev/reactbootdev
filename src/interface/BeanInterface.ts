export interface BeanInterface {
  className: string,
  classPath: string | undefined,
  decorators: DecoratorInfoInterface[],

  superClasses: {
    className: string,
    classPath: string | undefined,
  }[],
  members: {
    name: string,
    type: string,
    dataType: string,
    decorators: DecoratorInfoInterface[],
  }[]
}

export interface DecoratorInfoInterface {
  decoratorName: string;
  definition: string;
  arguments: { txt: string; type: string; value: any }[];
}

