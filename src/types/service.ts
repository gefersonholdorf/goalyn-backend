import type { Either } from "@/utils/either";

export interface Service<ServiceRequest, ServiceResponse> {
	execute(serviceRequest: ServiceRequest): Promise<Either<Error, ServiceResponse>>;
}