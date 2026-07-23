import { CanMessage } from '../../types/specifications';

export const mockCanMessages: CanMessage[] = [
  {
    "id": "0x0B3",
    "name": "MCU_Fault_Code",
    "txEcu": "MCU",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "100",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Standard frame",
    "signals": [
      "MCU_temp_cutoff",
      "motor_temp_cutoff_fault",
      "Motor_temp_warning",
      "Motor_temp_sensor_fault",
      "VCU_Brake_STG_Fault",
      "VCU_Brake_STB_Fault",
      "VCU_Throttle2_STG_Fault",
      "VCU_Throttle2_STB_Fault",
      "VCU_Throttle1_STB_Fault",
      "VCU_Throttle1_STG_Fault",
      "MCU_temp_warning",
      "MCU_temp_sensor_fault",
      "VCU_LowSOC_Fault",
      "VCU_AuxVoltage_cutoff",
      "VCU_AuxVoltage_Warning",
      "MCU_Encoder_Fault",
      "MCU_FET_OPEN_FAULT",
      "MCU_WheelLock_Fault",
      "MCU_SensorSupply_Fault",
      "MCU_OverCurrent_Fault",
      "MCU_DC_CurrSensor_Fault",
      "MCU_Foc_Fault",
      "MCU_PH_Sensor_Fault"
    ],
    "notes": "68"
  },
  {
    "id": "0x1038FF50",
    "name": "Error_info",
    "txEcu": "Vector__XXX",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "Cell_temp_Fault",
      "BatteryOverVoltage",
      "PDU_Lock",
      "DeepDischargeError",
      "Cell_imbalance",
      "BatterySevereThermalRunaway",
      "BatteryThermalRunawayWarning",
      "Cell_OV_Fault",
      "Cell_UV_fault",
      "BatteryShortCircuit",
      "BatteryOverLoad",
      "Precharge_Failure",
      "MOSFET_failure",
      "BatterySevereUnderVoltage",
      "BatteryUnderVoltage",
      "BatterySevereOverVoltage",
      "BatterySevereUnderTemp",
      "BatteryUnderTemp",
      "BatterySevereOvertemp",
      "BatteryOverTemp",
      "BatteryFault"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x10A00A01",
    "name": "FORSEE_POWER_CHG_TO_BMS",
    "txEcu": "CHARGER",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "0",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "FP_Charger_ID"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x0B1",
    "name": "MCU_Vehicle_DTE_km",
    "txEcu": "MCU",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "100",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Standard frame",
    "signals": [
      "Vehicle_DTE_Km"
    ],
    "notes": "68"
  },
  {
    "id": "0x18FF47D0",
    "name": "BMS_Energy_Capacity_Wh",
    "txEcu": "BMS",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "Batt_Capacity_Wh"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x18FF01D0",
    "name": "VOLTAGE_INFO",
    "txEcu": "Vector__XXX",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "Battery_Voltage",
      "Min_Voltage",
      "Max_Voltage"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x18FF02D0",
    "name": "CURRENT",
    "txEcu": "Vector__XXX",
    "bus": "CAN",
    "dlc": "4",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "68"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x18FF03D0",
    "name": "TEMPERATURE_INFO_CELL",
    "txEcu": "BMS",
    "bus": "CAN",
    "dlc": "6",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "Temperature_Cell_Min",
      "Temperature_Cell_Max",
      "Temperature_Cell_Mean"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x18FF07D0",
    "name": "BMS_Build_Info",
    "txEcu": "BMS",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "In_Reserved_Mode",
      "Reserved_Mode_Allowed",
      "High_SoC_Indication",
      "Low_SoC_Indication_2",
      "Low_SoC_Indication_1",
      "Is_fan_driven",
      "Is_heater_driven",
      "No_error_detected",
      "Sd_init_flag",
      "Sd_conf_file_param_error",
      "Sd_conf_file_opening_error",
      "Unused_1bit",
      "power_3V3_state",
      "External_power_supply_state",
      "Configuration_loaded",
      "Needs_balancing",
      "Is_running_state",
      "BLE_wake_up_request",
      "Start_request",
      "Isolated_input_1_state",
      "Isolated_input_0_state",
      "Power_channel_fan",
      "Power_channel_charge",
      "Power_channel_discharge",
      "Power_channel_precharge",
      "Power_channel_emergency",
      "Power_channel_heater_Plus",
      "Power_channel_heater_minus",
      "Low_SoC_Warning"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x1827FF81",
    "name": "MCU_StatChck_Two",
    "txEcu": "MCU",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "MCU_Motor_RPM",
      "MCU_Cap_Voltage",
      "MCU_Odometer_Val"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x1826FF81",
    "name": "MCU_Statchck_One",
    "txEcu": "MCU",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "540",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "MCU_Motor_Temp",
      "MCU_PCB_Temp",
      "MCU_Drive_Mode",
      "MCU_Speed_Kmph",
      "MCU_Brake_perc",
      "MCU_Throttle_perc"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x18FF05D0",
    "name": "BATTERY_STATE",
    "txEcu": "BMS",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "State_of_Health",
      "State_of_Charge"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x18FF3CD0",
    "name": "CURRENT_DERATING_INFO",
    "txEcu": "BMS",
    "bus": "CAN",
    "dlc": "4",
    "cycleTime": "1000",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Extended frame",
    "signals": [
      "Charge_derated_current",
      "Discharge_derated_current"
    ],
    "notes": "29-bit ID"
  },
  {
    "id": "0x701",
    "name": "CHARGER_DebugStatus",
    "txEcu": "CHARGER",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "10",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Standard frame",
    "signals": [
      "CHARGER_FaultStatus_St_B",
      "CHARGER_AckStatus_St_B"
    ],
    "notes": "68"
  },
  {
    "id": "0x603",
    "name": "BMS_StartUpStatus",
    "txEcu": "BMS",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "10",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Standard frame",
    "signals": [
      "BMS_PrechargeStatus_enum",
      "BMS_FETStatus_enum"
    ],
    "notes": "68"
  },
  {
    "id": "0x0A1",
    "name": "MCU_POWER_One",
    "txEcu": "MCU",
    "bus": "CAN",
    "dlc": "8",
    "cycleTime": "10",
    "aliveCounter": "TBD",
    "crc": "TBD",
    "description": "Standard frame",
    "signals": [
      "MCU_DCCapVoltage_Act_V",
      "MCU_MotorActSpeed_RPM"
    ],
    "notes": "68"
  }
];
