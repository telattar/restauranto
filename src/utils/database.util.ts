import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function isRecordNotFoundError(error: any): boolean {
  return error instanceof PrismaClientKnownRequestError && error.code === 'P2025';
}
