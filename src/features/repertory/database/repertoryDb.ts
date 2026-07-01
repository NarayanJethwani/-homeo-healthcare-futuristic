import { RepertoryRepository } from '../repositories/RepertoryRepository';
import { MemoryRepertoryRepository } from '../repositories/MemoryRepertoryRepository';

// Create a single global instance of our repository (using the in-memory version for Phase 1 safety)
export const repertoryRepository: RepertoryRepository = new MemoryRepertoryRepository();
export default repertoryRepository;
