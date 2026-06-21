export interface DetallePlanilla {
  idDetallePlanilla: number;
  detSalarioBase: number;
  detTotalIngresos: number;
  detTotalDescuentos: number;
  detSalarioNeto: number;
  idEmpleado: number;
  nombreEmpleado: string;
  idPlanilla: number;
  periodo: string;
}