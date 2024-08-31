import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findUsecase: UseCaseInterface;
    generateUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUsecase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;
    
    constructor(usecaseProps: UseCaseProps) {
        this._findUsecase = usecaseProps.findUsecase;
        this._generateUsecase = usecaseProps.generateUsecase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
       return await this._generateUsecase.execute(input);
    }

    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return await this._findUsecase.execute(input);
    }
  
}
