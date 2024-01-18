import { Inject, Injectable, LoggerService, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) { }

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl, body } = request;
        const userAgent = request.get("user-agent") || "";

        response.on("finish", () => {
            const { statusCode } = response;
            const contentLength = response.get("content-length");
            this.logger.log(`method : ${method}, originalUrl : ${originalUrl}, body : ${JSON.stringify(body)}, statusCode : ${statusCode}, contentLength : ${contentLength}, userAgent : ${userAgent}, ip : ${ip}`);
        
        });

        next();
    }
}