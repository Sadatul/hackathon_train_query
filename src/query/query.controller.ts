import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QueryService } from './query.service';

type queryType = {
    from : string,
    to : string,
    journeyDate : string
}

@Controller()
export class QueryController {
    constructor(private queryService: QueryService) { }

    @MessagePattern({ cmd: 'query_train_service' })
    async queryTrain(@Payload() query: queryType) {
        return await this.queryService.queryTrain(query)
    }
}
