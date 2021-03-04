/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import CPU from "../src/cpu";
import Registers from "../src/registers";
import Memory from "../src/memory";
import Opcodes from "../src/opcodes";
import { createMemoryFromTestRom } from "./helpers";

const CODE_LOCATION = 0x0200;

const cpu = new CPU();
const memory = new Memory();

function verifyStoreZeroPage(testCaseNumber: string, register: keyof Registers) {
  const operationSize = 2;
  let expectedPCLocation = CODE_LOCATION;
  const memory = createMemoryFromTestRom(testCaseNumber);
  cpu.Initialize(memory);

  const priorFlagStatus = cpu.Flags.Status;

  // Positive number case
  cpu.Registers[register] = 0x42;
  expect(cpu.Execute(3, memory)).toBe(3);
  expect(memory.readByte(0x00)).toBe(0x42);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Zero number
  cpu.Registers[register] = 0x00;
  expect(cpu.Execute(3, memory)).toBe(3);
  expect(memory.readByte(0x00)).toBe(0x00);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Negative number
  cpu.Registers[register] = 0b10010101;
  expect(cpu.Execute(3, memory)).toBe(3);
  expect(memory.readByte(0x00)).toBe(0b10010101);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags
}

function verifyStoreZeroPagePlusRegister(testCaseNumber: string, register: keyof Registers, offsetRegister: "X" | "Y") {
  const operationSize = 2;
  let expectedPCLocation = CODE_LOCATION;
  const memory = createMemoryFromTestRom(testCaseNumber);
  cpu.Initialize(memory);

  cpu.Registers[offsetRegister] = 0x01; // This gets added to the zero page location
  const priorFlagStatus = cpu.Flags.Status;

  // Positive number case
  cpu.Registers[register] = 0x42;
  expect(cpu.Execute(4, memory)).toBe(4);
  expect(memory.readByte(0x00 + 0x01)).toBe(0x42);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Zero number case
  cpu.Registers[register] = 0x00;
  expect(cpu.Execute(4, memory)).toBe(4);
  expect(memory.readByte(0x00 + 0x01)).toBe(0x00);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Negative number case
  cpu.Registers[register] = 0b10010101;
  expect(cpu.Execute(4, memory)).toBe(4);
  expect(memory.readByte(0x00 + 0x01)).toBe(0b10010101);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags  
}

function verifyStoreAbsolute(testCaseNumber: string, register: keyof Registers) {
  const operationSize = 3;
  let expectedPCLocation = CODE_LOCATION;
  const memory = createMemoryFromTestRom(testCaseNumber);
  cpu.Initialize(memory);

  const priorFlagStatus = cpu.Flags.Status;

  // Positive number case
  cpu.Registers[register] = 0x42;
  expect(cpu.Execute(4, memory)).toBe(4);
  expect(memory.readByte(0x4000)).toBe(0x42);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Zero number case
  cpu.Registers[register] = 0x00;
  expect(cpu.Execute(4, memory)).toBe(4);
  expect(memory.readByte(0x4000)).toBe(0x00);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Negative number case
  cpu.Registers[register] = 0b10010101;
  expect(cpu.Execute(4, memory)).toBe(4);
  expect(memory.readByte(0x4000)).toBe(0b10010101);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags
}

function verifyStoreAbsolutePlusOffset(testCaseNumber: string, register: keyof Registers, offsetRegister: "X" | "Y") {
  const operationSize = 3;
  let expectedPCLocation = CODE_LOCATION;
  const memory = createMemoryFromTestRom(testCaseNumber);
  cpu.Initialize(memory);

  const priorFlagStatus = cpu.Flags.Status;
  cpu.Registers[offsetRegister] = 0x01;

  // Positive number case
  cpu.Registers[register] = 0x42;
  expect(cpu.Execute(5, memory)).toBe(5);
  expect(memory.readByte(0x4000 + 0x01)).toBe(0x42);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags

  // Zero number case
  cpu.Registers[register] = 0x00;
  expect(cpu.Execute(5, memory)).toBe(5);
  expect(memory.readByte(0x4000 + 0x01)).toBe(0x00);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags  

  // Negative number case
  cpu.Registers[register] = 0b10010101;
  expect(cpu.Execute(5, memory)).toBe(5);
  expect(memory.readByte(0x4000 + 0x01)).toBe(0b10010101);
  expectedPCLocation += operationSize;
  expect(cpu.PC).toBe(expectedPCLocation);
  expect(cpu.Flags.Status).toBe(priorFlagStatus); // Operation shouldn't modify the flags  
}

test("0100 - Verify STA zero page", () => {
  verifyStoreZeroPage("0100", "A");
});

test("0101 - Verify STX zero page", () => {
  verifyStoreZeroPage("0101", "X");
});

test("0102 - Verify STY zero page", () => {
  verifyStoreZeroPage("0102", "Y");
});

test("0103 - Verify STA zero page plus X", () => {
  verifyStoreZeroPagePlusRegister("0103", "A", "X");
});

test("0104 - Verify STX zero page plus Y", () => {
  verifyStoreZeroPagePlusRegister("0104", "X", "Y");
});

test("0105 - Verify STY zero page plus X", () => {
  verifyStoreZeroPagePlusRegister("0105", "Y", "X");
});

test("0106 - Verify STA absolute", () => {
  verifyStoreAbsolute("0106", "A");
});

test("0107 - Verify STX absolute", () => {
  verifyStoreAbsolute("0107", "X");
});

test("0108 - Verify STY absolute", () => {
  verifyStoreAbsolute("0108", "Y");
});

test("Verify STA absolute plus X", () => {
  verifyStoreAbsolutePlusOffset("0109", "A", "X");
});

test("Verify STA absolute plus Y", () => {
  verifyStoreAbsolutePlusOffset("0110", "A", "Y");
});
