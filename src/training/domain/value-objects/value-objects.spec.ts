import { describe, it, expect } from 'vitest';
import {
  Rpe,
  PesoKg,
  Weight,
  Duration,
  SessionDate,
  SerieRegistrada,
} from './index.js';
import { LoggedSet } from '../logged-set.entity.js';
import { WorkoutSession } from '../workout-session.entity.js';
import { BodyWeightRecord } from '../body-weight-record.entity.js';

describe('Value Objects del Proyecto GYM (SPMP 6.5.2 & 6.8.5)', () => {
  describe('1. RPE (Rate of Perceived Exertion)', () => {
    it('Crea una instancia válida con valores entre 1 y 10', () => {
      const rpeMin = new Rpe(1);
      const rpeMid = new Rpe(7.5);
      const rpeMax = new Rpe(10);

      expect(rpeMin.value).toBe(1);
      expect(rpeMid.value).toBe(7.5);
      expect(rpeMax.value).toBe(10);
      expect(rpeMid.toString()).toBe('RPE 7.5');
    });

    it('Rechaza valores menores a 1 o mayores a 10', () => {
      expect(() => new Rpe(0)).toThrow('El RPE debe estar comprendido en la escala de 1 a 10');
      expect(() => new Rpe(11)).toThrow('El RPE debe estar comprendido en la escala de 1 a 10');
      expect(() => new Rpe(-2)).toThrow('El RPE debe estar comprendido en la escala de 1 a 10');
      expect(() => new Rpe(NaN)).toThrow('El RPE debe ser un valor numérico');
    });

    it('Compara por valor mediante equals()', () => {
      const rpeA = new Rpe(8);
      const rpeB = new Rpe(8);
      const rpeC = new Rpe(9);

      expect(rpeA.equals(rpeB)).toBe(true);
      expect(rpeA.equals(rpeC)).toBe(false);
      expect(rpeA.equals(null as any)).toBe(false);
    });

    it('Garantiza inmutabilidad (sin setters públicos)', () => {
      const rpe = new Rpe(8);
      // ts-expect-error No debe existir setter
      expect(() => { (rpe as any).value = 5; }).toThrow();
    });
  });

  describe('2. PesoKg', () => {
    it('Crea una instancia válida con peso >= 0', () => {
      const pesoCero = new PesoKg(0);
      const pesoCien = new PesoKg(100.5);

      expect(pesoCero.value).toBe(0);
      expect(pesoCien.value).toBe(100.5);
      expect(pesoCien.toString()).toBe('100.5 kg');
    });

    it('Rechaza pesos negativos o no numéricos', () => {
      expect(() => new PesoKg(-1)).toThrow('El peso levantado no puede ser un valor negativo');
      expect(() => new PesoKg(NaN)).toThrow('El peso levantado debe ser un número válido');
    });

    it('Compara por valor mediante equals()', () => {
      const p1 = new PesoKg(80);
      const p2 = new PesoKg(80);
      const p3 = new PesoKg(82.5);

      expect(p1.equals(p2)).toBe(true);
      expect(p1.equals(p3)).toBe(false);
    });
  });

  describe('3. SerieRegistrada (LoggedSet)', () => {
    it('Crea una serie registrada válida e inmutable', () => {
      const serie = new SerieRegistrada('ex-1', 'Sentadilla', 1, 10, 100, true);

      expect(serie.exerciseId).toBe('ex-1');
      expect(serie.exerciseName).toBe('Sentadilla');
      expect(serie.setNumber).toBe(1);
      expect(serie.actualReps).toBe(10);
      expect(serie.actualWeightKg).toBe(100);
      expect(serie.actualWeight.equals(new PesoKg(100))).toBe(true);
      expect(serie.isCompleted).toBe(true);
    });

    it('Valida número de serie y repeticiones no negativas', () => {
      expect(() => new SerieRegistrada('ex-1', 'Sentadilla', 0, 10, 100)).toThrow(
        'El número de serie debe ser mayor o igual a 1',
      );
      expect(() => new SerieRegistrada('ex-1', 'Sentadilla', 1, -2, 100)).toThrow(
        'Las repeticiones no pueden ser un valor negativo',
      );
      expect(() => new SerieRegistrada('', 'Sentadilla', 1, 10, 100)).toThrow(
        'El ID de ejercicio es obligatorio',
      );
    });

    it('Compara dos series por sus atributos con equals()', () => {
      const s1 = new SerieRegistrada('ex-1', 'Press Banca', 1, 8, 80, true);
      const s2 = new SerieRegistrada('ex-1', 'Press Banca', 1, 8, 80, true);
      const s3 = new SerieRegistrada('ex-1', 'Press Banca', 2, 8, 80, true);

      expect(s1.equals(s2)).toBe(true);
      expect(s1.equals(s3)).toBe(false);
    });

    it('Interopera limpiamente con la entidad LoggedSet', () => {
      const entity = new LoggedSet('uuid-123', 'ex-1', 'Sentadilla', 1, 10, 100, true);
      const vo = entity.toValueObject();

      expect(vo).toBeInstanceOf(SerieRegistrada);
      expect(vo.actualWeightKg).toBe(100);

      const rebuiltEntity = LoggedSet.fromValueObject(vo, 'uuid-123');
      expect(entity.equals(rebuiltEntity)).toBe(true);
    });
  });

  describe('4. Weight (Peso Corporal Antropométrico)', () => {
    it('Crea un peso corporal estrictamente positivo (> 0)', () => {
      const w = new Weight(75.4);
      expect(w.value).toBe(75.4);
      expect(w.toString()).toBe('75.4 kg');
    });

    it('Rechaza pesos menores o iguales a 0', () => {
      expect(() => new Weight(0)).toThrow('El peso corporal debe ser un valor positivo mayor a 0');
      expect(() => new Weight(-5)).toThrow('El peso corporal debe ser un valor positivo mayor a 0');
      expect(() => new Weight(NaN)).toThrow('El peso corporal debe ser un número válido');
    });

    it('Compara por valor mediante equals()', () => {
      const w1 = new Weight(70);
      const w2 = new Weight(70);
      const w3 = new Weight(71);

      expect(w1.equals(w2)).toBe(true);
      expect(w1.equals(w3)).toBe(false);
    });

    it('Se integra en la entidad BodyWeightRecord', () => {
      const record = new BodyWeightRecord('id-1', 'ath-1', 78.5, new Date());
      expect(record.weight).toBeInstanceOf(Weight);
      expect(record.weight.value).toBe(78.5);
    });
  });

  describe('5. Duration (Duración de la Sesión)', () => {
    it('Crea una duración válida en minutos', () => {
      const d = new Duration(90);
      expect(d.minutes).toBe(90);
      expect(d.toHours()).toBe(1.5);
      expect(d.toString()).toBe('90 min');
    });

    it('Rechaza duraciones negativas', () => {
      expect(() => new Duration(-10)).toThrow('La duración de la sesión no puede ser un valor negativo');
      expect(() => new Duration(NaN)).toThrow('La duración debe ser un número válido');
    });

    it('Compara por valor mediante equals()', () => {
      const d1 = new Duration(60);
      const d2 = new Duration(60);
      const d3 = new Duration(45);

      expect(d1.equals(d2)).toBe(true);
      expect(d1.equals(d3)).toBe(false);
    });
  });

  describe('6. SessionDate (Fecha de Sesión)', () => {
    it('Crea una fecha de sesión a partir de un Date o string ISO', () => {
      const date = new SessionDate('2026-10-15T10:00:00Z');
      expect(date.toDateString()).toBe('2026-10-15');
      expect(date.toISOString()).toContain('2026-10-15');
    });

    it('Rechaza fechas inválidas', () => {
      expect(() => new SessionDate('fecha-invalida')).toThrow('Fecha de sesión inválida');
    });

    it('Mantiene inmutabilidad (copia defensiva en getter value)', () => {
      const originalDate = new Date('2026-10-15T10:00:00Z');
      const sessionDate = new SessionDate(originalDate);

      const retrievedDate = sessionDate.value;
      retrievedDate.setFullYear(2030); // mutación en el objeto obtenido

      expect(sessionDate.value.getFullYear()).toBe(2026); // No mutó el VO interno
    });

    it('Compara por valor mediante equals()', () => {
      const d1 = new SessionDate('2026-10-15T10:00:00.000Z');
      const d2 = new SessionDate('2026-10-15T10:00:00.000Z');
      const d3 = new SessionDate('2026-10-16T10:00:00.000Z');

      expect(d1.equals(d2)).toBe(true);
      expect(d1.equals(d3)).toBe(false);
    });

    it('Se integra en el agregado WorkoutSession', () => {
      const session = new WorkoutSession(
        'sess-1',
        'ath-1',
        'plan-1',
        'routine-1',
        'Piernas',
        new Date('2026-10-15'),
        true,
        [new LoggedSet('s1', 'ex-1', 'Sentadilla', 1, 10, 100, true)],
        'Sin dolor',
        8, // RPE
        new Date(),
        75, // Duration
      );

      expect(session.sessionDate).toBeInstanceOf(SessionDate);
      expect(session.rpeVo).toBeInstanceOf(Rpe);
      expect(session.rpeVo?.value).toBe(8);
      expect(session.duration).toBeInstanceOf(Duration);
      expect(session.duration?.minutes).toBe(75);
      expect(session.seriesRegistradas.length).toBe(1);
      expect(session.seriesRegistradas[0]).toBeInstanceOf(SerieRegistrada);
    });
  });
});
