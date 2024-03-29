/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import AddressModes from "../addressModes";
import CPU from "../cpu";
import Memory from "../memory";
import Registers from "../registers";

/**
 * Stores data from memory in the specified register.
 * @param cpu The CPU to use when executing the command.
 * @param memory Memory to read the data from.
 * @param addressMode Address mode to use to find the data.
 * @param register The register to store the data in.
 */
export function StoreRegister(cpu: CPU, memory: Memory, addressMode: AddressModes, register: keyof Registers): void {
  const dataAddress = cpu.CalculateAddressFromAddressMode(memory, addressMode, false);

  // Storing using any of these indirect modes consumes an additional cycle for some reason
  if (
    addressMode === AddressModes.AbsoluteX ||
    addressMode === AddressModes.AbsoluteY ||
    addressMode === AddressModes.IndirectY
  ) {
    cpu.consumedCycles++;
  }
  memory.writeByte(dataAddress, cpu.Registers[register]);
  cpu.consumedCycles++;
}
