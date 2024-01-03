import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = this.createErrorResponse(exception, status);

    response.status(status).json(errorResponse);
  }

  private createErrorResponse(exception: HttpException, status: number) {
    const message = this.extractMessageFromException(exception.getResponse());

    if (typeof message === 'object') {
      return {
        code: status,
        error: exception.name,
        ...message,
      };
    } else {
      return {
        code: status,
        error: exception.name,
        message: this.getErrorMessage(status, message),
      };
    }
  }

  private extractMessageFromException(response: any): string | object {
    if (typeof response === 'string') {
      return response;
    } else if (typeof response['message'] === 'string') {
      return response['message'];
    } else if (Array.isArray(response['message'])) {
      return response['message'][0];
    } else {
      return response['message'];
    }
  }

  private getErrorMessage(status: number, message: string): string {
    return status === HttpStatus.UNAUTHORIZED
      ? message || 'Incorrect credentials'
      : message || 'Sometimes we make mistakes';
  }
}
