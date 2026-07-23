import { mockRequirements } from '@/data/mock/requirements';
import { mockSignals } from '@/data/mock/signals';
import { mockCanMessages } from '@/data/mock/canMessages';
import { mockRoleAccess } from '@/data/mock/roleAccess';
import { mockArchitecture } from '@/data/mock/architecture';
import { mockVvDeliverables } from '@/data/mock/vvDeliverables';
import {
  Requirement,
  Signal,
  CanMessage,
  RoleAccess,
  ArchitectureCompliance,
  VvDeliverable,
} from '@/types/specifications';

export const SpecificationService = {
  getRequirements(): readonly Requirement[] {
    return mockRequirements;
  },

  getSignals(): readonly Signal[] {
    return mockSignals;
  },

  getCanMessages(): readonly CanMessage[] {
    return mockCanMessages;
  },

  getRoleAccess(): readonly RoleAccess[] {
    return mockRoleAccess;
  },

  getArchitectureCompliance(): readonly ArchitectureCompliance[] {
    return mockArchitecture;
  },

  getVvDeliverables(): readonly VvDeliverable[] {
    return mockVvDeliverables;
  },
};
export type { Requirement, Signal, CanMessage, RoleAccess, ArchitectureCompliance, VvDeliverable };
