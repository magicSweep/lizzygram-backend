export type ValidateReqParamsProps = {
  reqBody?: any;
  reqParams?: any;
};

export type ValidateReqParams = (
  props: ValidateReqParamsProps
) => boolean | string;
