--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.exercise_items DROP CONSTRAINT IF EXISTS "FK_f8dac810da6d09dbb452f218346";
ALTER TABLE IF EXISTS ONLY public.logged_sets DROP CONSTRAINT IF EXISTS "FK_7bcb31b3fac6784840e21b4d278";
ALTER TABLE IF EXISTS ONLY public.routines DROP CONSTRAINT IF EXISTS "FK_2232c7b89137c0994080362aed7";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3";
ALTER TABLE IF EXISTS ONLY public.muscle_groups DROP CONSTRAINT IF EXISTS "UQ_7b67dd7f791008ed1532e76a9c4";
ALTER TABLE IF EXISTS ONLY public.target_zones DROP CONSTRAINT IF EXISTS "UQ_36eee1396edbc70a0e43d56e82e";
ALTER TABLE IF EXISTS ONLY public.exercise_items DROP CONSTRAINT IF EXISTS "PK_ffbf4abe0dd6df9d53b33564bd3";
ALTER TABLE IF EXISTS ONLY public.logged_sets DROP CONSTRAINT IF EXISTS "PK_f8641a8945e0f473f485310e66b";
ALTER TABLE IF EXISTS ONLY public.workout_sessions DROP CONSTRAINT IF EXISTS "PK_eea00e05dc78d40b55a588c9f57";
ALTER TABLE IF EXISTS ONLY public.target_zones DROP CONSTRAINT IF EXISTS "PK_e325a53ab6227dab2c658791221";
ALTER TABLE IF EXISTS ONLY public.body_weight_records DROP CONSTRAINT IF EXISTS "PK_ccd5631be9337836859033a6a4a";
ALTER TABLE IF EXISTS ONLY public.exercises DROP CONSTRAINT IF EXISTS "PK_c4c46f5fa89a58ba7c2d894e3c3";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.muscle_groups DROP CONSTRAINT IF EXISTS "PK_87e03ee9f78be5d7a7d0e08897e";
ALTER TABLE IF EXISTS ONLY public.routine_templates DROP CONSTRAINT IF EXISTS "PK_6dd604fbdbc8f323d75ebd1ebc9";
ALTER TABLE IF EXISTS ONLY public.routines DROP CONSTRAINT IF EXISTS "PK_6847e8f0f74e65a6f10409dee9f";
ALTER TABLE IF EXISTS ONLY public.training_plans DROP CONSTRAINT IF EXISTS "PK_246975cb895b51662b90515a390";
DROP TABLE IF EXISTS public.workout_sessions;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.training_plans;
DROP TABLE IF EXISTS public.target_zones;
DROP TABLE IF EXISTS public.routines;
DROP TABLE IF EXISTS public.routine_templates;
DROP TABLE IF EXISTS public.muscle_groups;
DROP TABLE IF EXISTS public.logged_sets;
DROP TABLE IF EXISTS public.exercises;
DROP TABLE IF EXISTS public.exercise_items;
DROP TABLE IF EXISTS public.body_weight_records;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: body_weight_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.body_weight_records (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "athleteId" character varying NOT NULL,
    "weightKg" double precision NOT NULL,
    notes character varying,
    "recordedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.body_weight_records OWNER TO postgres;

--
-- Name: exercise_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "exerciseId" character varying NOT NULL,
    "exerciseName" character varying NOT NULL,
    "targetSets" integer NOT NULL,
    "targetReps" integer NOT NULL,
    "targetWeightKg" double precision NOT NULL,
    "restSeconds" integer,
    notes character varying,
    "routineId" uuid NOT NULL,
    cadence character varying
);


ALTER TABLE public.exercise_items OWNER TO postgres;

--
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    "grupoMuscularPrincipal" character varying NOT NULL,
    "zonasTrabajadas" text NOT NULL,
    descripcion text NOT NULL,
    "videoUrl" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- Name: logged_sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logged_sets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "exerciseId" character varying NOT NULL,
    "exerciseName" character varying NOT NULL,
    "setNumber" integer NOT NULL,
    "actualReps" integer NOT NULL,
    "actualWeightKg" double precision NOT NULL,
    "isCompleted" boolean DEFAULT true NOT NULL,
    "sessionId" uuid NOT NULL
);


ALTER TABLE public.logged_sets OWNER TO postgres;

--
-- Name: muscle_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.muscle_groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.muscle_groups OWNER TO postgres;

--
-- Name: routine_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routine_templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "trainerId" character varying NOT NULL,
    name character varying NOT NULL,
    description character varying,
    category character varying,
    "exerciseItemsJson" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.routine_templates OWNER TO postgres;

--
-- Name: routines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "dayOfWeek" integer NOT NULL,
    description character varying,
    "trainingPlanId" uuid NOT NULL
);


ALTER TABLE public.routines OWNER TO postgres;

--
-- Name: target_zones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.target_zones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "muscleGroupName" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.target_zones OWNER TO postgres;

--
-- Name: training_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training_plans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "athleteId" character varying NOT NULL,
    "trainerId" character varying NOT NULL,
    "athleteName" character varying,
    "trainerName" character varying,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "frequencyPerWeek" integer DEFAULT 3 NOT NULL,
    "sessionsPerDay" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.training_plans OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    "fullName" character varying NOT NULL,
    role character varying DEFAULT 'ATLETA'::character varying NOT NULL,
    phone character varying,
    notes character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "trainerId" character varying,
    "avatarUrl" text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: workout_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workout_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "athleteId" character varying NOT NULL,
    "trainingPlanId" character varying NOT NULL,
    "routineId" character varying NOT NULL,
    "routineName" character varying NOT NULL,
    date date NOT NULL,
    completed boolean DEFAULT true NOT NULL,
    notes character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    rpe integer
);


ALTER TABLE public.workout_sessions OWNER TO postgres;

--
-- Data for Name: body_weight_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.body_weight_records (id, "athleteId", "weightKg", notes, "recordedAt") FROM stdin;
ef865512-97b0-4df3-9d3d-fe5823a58ae0	c389507d-0b39-4efc-8fc3-dff49166acdf	77.2	Pesaje semana 4	2026-09-22 20:18:55.03
e0846e53-5b16-421f-b18d-bec786bad31a	c389507d-0b39-4efc-8fc3-dff49166acdf	76.5	Pesaje semana 3	2026-09-29 20:18:55.044
bfceb813-9deb-45f7-8ed0-878863bbbdb4	c389507d-0b39-4efc-8fc3-dff49166acdf	75.9	Pesaje semana 2	2026-10-06 20:18:55.055
61ffee59-ec24-4b8c-95fa-ab77ad0f62e4	c389507d-0b39-4efc-8fc3-dff49166acdf	75.5	Pesaje semana 1	2026-10-13 20:18:55.066
8e8bcc6e-0969-400c-887c-26458fd8b999	c389507d-0b39-4efc-8fc3-dff49166acdf	90	Pesaje de Tercera Semana	2026-10-13 21:15:33.668
15474799-8f05-412e-9352-75ef635574cf	c389507d-0b39-4efc-8fc3-dff49166acdf	92	\N	2026-10-14 21:06:41.454
\.


--
-- Data for Name: exercise_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercise_items (id, "exerciseId", "exerciseName", "targetSets", "targetReps", "targetWeightKg", "restSeconds", notes, "routineId", cadence) FROM stdin;
259f8812-0ab6-4759-a70a-5accbee0569e	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	120	Descanso 2 min entre series	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	\N
03d18480-75f0-49b3-8247-5de0318ee7c3	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	90	Control excéntrico de 2 seg	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	\N
5325fdb1-d1ee-40ef-b04f-ba44dd7ca1e7	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	3	6	110	150	Cinturón recomendado	9fc6841e-589e-4c31-ba69-6d45205b21af	\N
0cb43f9b-c5fc-41e5-9f9a-137b709b4ce7	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	3	10	45	90	Core firme	9fc6841e-589e-4c31-ba69-6d45205b21af	\N
1b9cca25-8692-48c1-a0e0-12739f89854d	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	4	8	75	120	Descanso completo	8ea31c92-bbea-4e29-88f2-ee0a0b43031d	\N
f2fccda2-95c1-4005-a0bb-acd739b72eec	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	3	10	50	90	Descanzo medio	8ea31c92-bbea-4e29-88f2-ee0a0b43031d	\N
dafaef57-aec0-4ba7-8bf1-c6fc70ce9a9f	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	4	10	60	90	RPE 8	35bd926a-07f0-491d-a417-c63f0ac162b4	\N
5447f2e3-ce66-458e-8453-ba5af3e5d5b3	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	4	8	75	120	Descanso completo	12cbdc04-50a0-484b-999e-7de76cd62e3e	\N
6e5534db-8426-47d1-8af1-6068b1a416e6	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	4	10	60	90	RPE 8	1aa32830-766a-44c7-9f50-e33a7bbff5c7	\N
b95f5315-7496-42c6-8539-bd8e9406ea9d	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	3	10	50	90		1aa32830-766a-44c7-9f50-e33a7bbff5c7	\N
7af2082c-4465-45ce-a874-f940c5934126	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	5	12	55	120	Descanso de 90 la de 120 es en la tercera	1aa32830-766a-44c7-9f50-e33a7bbff5c7	\N
923a597e-bb53-4494-9ccb-02ae8c218a63	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	90	Control en la fase excéntrica	411d152f-fc61-46e0-bd9d-0aa38ab47f83	3-0-1-0
65f2516e-d708-46fe-ac1f-e21a587a224d	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90		411d152f-fc61-46e0-bd9d-0aa38ab47f83	2-0-1-0
baa2804f-ec6b-44ae-982e-e9325c2c7aa0	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	90	Control en la fase excéntrica	41add26a-4f6d-4dd2-923b-8a7ead0b0bd4	3-0-1-0
b4043118-c593-4e5a-aacb-fdf36cc10630	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	90	Control en la fase excéntrica	60e8c6f7-5f34-48d3-9b61-abe71a6ded5a	3-0-1-0
0da74532-cc39-4efa-b8ed-661ec0d2b0aa	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	90	Control en la fase excéntrica	ddf19dc2-b424-40f6-9c09-049c093513b6	3-0-1-0
f2f11b40-c607-4ef9-8071-93033e4668c3	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	3	10	50	90		9b807b1d-5720-46a5-bd23-2b30c0d6772b	2-0-1-0
f9215dac-bdba-4445-bd47-9f39951133c8	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	3	10	50	90		9b807b1d-5720-46a5-bd23-2b30c0d6772b	2-0-1-0
12d9a328-0ee1-4c28-9f50-8340598842da	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	90	Control en la fase excéntrica	687088ca-32d5-4b94-8143-2ea8005a1a3a	3-0-1-0
1e47b7c8-ca42-47bd-9cee-a3fe86ca94c9	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90		687088ca-32d5-4b94-8143-2ea8005a1a3a	2-0-1-0
24089333-5cab-439a-8961-2ce7e60ab638	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	90	Control en la fase excéntrica	e80b21d0-558c-4e9d-b392-31d42c7fc360	3-0-1-0
fa44af9e-0890-4c11-9ef3-563ab6767707	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90		e80b21d0-558c-4e9d-b392-31d42c7fc360	2-0-1-0
1cac067d-9e14-4e88-b265-13d87682a14a	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90		0e949eca-9d66-4375-b960-4b780daa544d	2-0-1-0
1164cf3b-4a11-41c4-b922-f82da6129f13	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano con Barra	4	8	30	120	Retracción escapular activa y apóyate bien en los pies.	06ddbac3-cc8e-4021-967c-c0172f514375	2-0-1-0
72573151-e82b-4ecf-a299-3c336319970f	af157a69-7232-462e-a23f-42afe6ba47ae	Press Inclinado con Mancuernas	3	10	30	90	Banco a 30°-45°. Bajar controlado abriendo el pecho.	06ddbac3-cc8e-4021-967c-c0172f514375	2-0-1-0
4705c3a5-2872-4b48-b33f-cf146b5946cb	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Mancuernas	3	8	20	90	Contrae glúteos y abdomen para estabilizar la columna.	06ddbac3-cc8e-4021-967c-c0172f514375	2-0-1-0
2cd1b931-1d8b-4e82-a3ef-ce56160e661e	41a4b7cc-0b50-4126-b940-eae25d003b50	Elevaciones Laterales con Mancuernas	3	15	10	60	Elevar en el plano escapular sin balancear el torso.	06ddbac3-cc8e-4021-967c-c0172f514375	2-0-1-1
092fec0f-e26b-4485-8eab-bbbbfb662b0f	9596f153-4b63-44ac-92cc-9961a4104690	Extensión de Tríceps en Polea Alta con Cuerda	3	12	30	60	Codos pegados al cuerpo, buscar máxima extensión abajo.	06ddbac3-cc8e-4021-967c-c0172f514375	2-0-1-1
e198a7ee-196f-4701-962c-8a48f36f40e4	b8f39395-319f-49da-b53e-aa1b2da08742	Abducciones de Cadena en Máquina / Polea	3	10	50	90		06ddbac3-cc8e-4021-967c-c0172f514375	2-0-1-0
2383418e-9ae4-42ed-bfc8-6e245a62893e	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90	Retracción escapular activa al iniciar el movimiento.	42c44cd0-459d-4ad3-887a-8aa57a3800d2	2-0-1-0
954efec1-8898-4e90-8e65-8db59afb729d	0108d8b1-a26a-4e50-bf82-fe638031bd1e	Remo con Barra T o Barra Libre	4	8	40	90	Torso a 45°, llevar la barra hacia el ombligo.	42c44cd0-459d-4ad3-887a-8aa57a3800d2	2-0-1-0
dba1c099-63c9-4571-9273-69adedae5151	ac5b0f41-d73c-4d3d-916a-1d0053fc46f3	Jalón al Pecho en Polea	3	12	30	60	Traccionar guiando con los codos hacia abajo y atrás.	42c44cd0-459d-4ad3-887a-8aa57a3800d2	2-0-1-1
e4553f1b-9731-494a-b5ad-512dc7c76bb1	52e4e02e-a17f-4e59-98d8-b8726929937c	Face Pull en Polea	3	15	12	60	Enfoque en deltoides posterior y salud articular del hombro.	42c44cd0-459d-4ad3-887a-8aa57a3800d2	2-0-1-1
b14a29bb-fde4-4b45-8653-c054eecab54e	783224e8-79f2-4539-8e2b-b6496de30e75	Curl de Bíceps con Barra EZ / Mancuernas	3	10	30	60	Mantener los codos inmóviles al costado del torso.	42c44cd0-459d-4ad3-887a-8aa57a3800d2	2-0-1-0
ecab53eb-7a82-4157-9763-dfff9c06e3aa	1a66acaa-1e55-4169-bdee-950317e6215b	Sentadilla Trasera con Barra (Back Squat)	4	8	30	120	Bajar manteniendo la alineación de las rodillas con la punta del pie.	4ae6544d-a1eb-4497-b09f-0014c0e567f5	2-1-1-0
0d776a8e-4f42-47ce-b12d-30596c5f3069	27be7347-67b6-4fa4-bf04-bf6b4dd907f8	Peso Muerto Rumano (RDL)	3	10	20	90	Llevar la cadera atrás manteniendo la espalda completamente neutra.	4ae6544d-a1eb-4497-b09f-0014c0e567f5	3-0-1-0
66f5b2bd-4389-4645-a120-57e09abaecd4	0105a89f-68a4-4739-ad21-39ae7b797c56	Prensa 45° (Leg Press)	3	12	50	90	Pies bien apoyados, no bloquear rodillas en la extensión máxima.	4ae6544d-a1eb-4497-b09f-0014c0e567f5	2-0-1-0
8e94d0aa-ac53-4fee-aae6-a5daa4b81187	39ae0b69-6959-4d7a-951a-298567a48495	Hip Thrust con Barra	3	12	15	90	Apriete fuerte de glúteos arriba durante 1 segundo.	4ae6544d-a1eb-4497-b09f-0014c0e567f5	2-0-1-1
f40eb89b-83ed-4a7f-8222-0e0cd841e6c4	1acaf7c1-ce85-4102-8b69-c0dbce8dfc11	Plancha Abdominal Estática (Plank)	3	45	0	60	Cuerpo alineado, retroversión pélvica y abdomen firme.	4ae6544d-a1eb-4497-b09f-0014c0e567f5	00000
65134c16-1590-472f-bb9c-4f56b06c3886	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano con Barra	4	8	30	120	Retracción escapular activa y apóyate bien en los pies.	7fe8c3ae-1529-467d-a080-6cb7abf843c5	2-0-1-0
3ef65fae-3c38-4743-bb1b-5d7aa2958d97	af157a69-7232-462e-a23f-42afe6ba47ae	Press Inclinado con Mancuernas	3	10	30	90	Banco a 30°-45°. Bajar controlado abriendo el pecho.	7fe8c3ae-1529-467d-a080-6cb7abf843c5	2-0-1-0
1d799aa3-3f3f-478d-ad12-c424f2104c9f	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Mancuernas	3	8	20	90	Contrae glúteos y abdomen para estabilizar la columna.	7fe8c3ae-1529-467d-a080-6cb7abf843c5	2-0-1-0
3d57d49a-4447-4f40-ab9e-0aa426ed78a7	41a4b7cc-0b50-4126-b940-eae25d003b50	Elevaciones Laterales con Mancuernas	3	15	10	60	Elevar en el plano escapular sin balancear el torso.	7fe8c3ae-1529-467d-a080-6cb7abf843c5	2-0-1-1
4f07ea8d-f3f7-4ecc-8943-3adfc53c23dc	9596f153-4b63-44ac-92cc-9961a4104690	Extensión de Tríceps en Polea Alta con Cuerda	3	12	30	60	Codos pegados al cuerpo, buscar máxima extensión abajo.	7fe8c3ae-1529-467d-a080-6cb7abf843c5	2-0-1-1
def41571-87c3-4f71-aa26-8c0124024e2b	b8f39395-319f-49da-b53e-aa1b2da08742	Abducciones de Cadena en Máquina / Polea	3	10	50	90		7fe8c3ae-1529-467d-a080-6cb7abf843c5	2-0-1-0
fd06ab85-3cd3-4c0e-bcf9-28db21abc782	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90	Retracción escapular activa al iniciar el movimiento.	144873c6-e496-4474-abe0-568e10156248	2-0-1-0
6745f4d8-4a38-4bfe-aaa7-213e6091d753	0108d8b1-a26a-4e50-bf82-fe638031bd1e	Remo con Barra T o Barra Libre	4	8	40	90	Torso a 45°, llevar la barra hacia el ombligo.	144873c6-e496-4474-abe0-568e10156248	2-0-1-0
e735be55-c152-44c8-886d-a4e7fef03473	ac5b0f41-d73c-4d3d-916a-1d0053fc46f3	Jalón al Pecho en Polea	3	12	30	60	Traccionar guiando con los codos hacia abajo y atrás.	144873c6-e496-4474-abe0-568e10156248	2-0-1-1
48e7edd1-4a6e-449b-b06c-a0c795e68be9	52e4e02e-a17f-4e59-98d8-b8726929937c	Face Pull en Polea	3	15	12	60	Enfoque en deltoides posterior y salud articular del hombro.	144873c6-e496-4474-abe0-568e10156248	2-0-1-1
e4d68501-74a0-4d7d-af44-e70de6d5bb12	783224e8-79f2-4539-8e2b-b6496de30e75	Curl de Bíceps con Barra EZ / Mancuernas	3	10	30	60	Mantener los codos inmóviles al costado del torso.	144873c6-e496-4474-abe0-568e10156248	2-0-1-0
4e2790ba-f9f4-4b57-a8e4-1780643ea177	1a66acaa-1e55-4169-bdee-950317e6215b	Sentadilla Trasera con Barra (Back Squat)	4	8	30	120	Bajar manteniendo la alineación de las rodillas con la punta del pie.	af872113-4dcd-412f-be3b-79f817057a77	2-1-1-0
1e601210-abaa-4941-9d56-0ed2ca6f086c	27be7347-67b6-4fa4-bf04-bf6b4dd907f8	Peso Muerto Rumano (RDL)	3	10	20	90	Llevar la cadera atrás manteniendo la espalda completamente neutra.	af872113-4dcd-412f-be3b-79f817057a77	3-0-1-0
69131dd8-daa2-417c-89d0-d0c02bbd4633	0105a89f-68a4-4739-ad21-39ae7b797c56	Prensa 45° (Leg Press)	3	12	50	90	Pies bien apoyados, no bloquear rodillas en la extensión máxima.	af872113-4dcd-412f-be3b-79f817057a77	2-0-1-0
95a5bc62-b0ff-4edd-b37e-eb2c29f91d2f	39ae0b69-6959-4d7a-951a-298567a48495	Hip Thrust con Barra	3	12	15	90	Apriete fuerte de glúteos arriba durante 1 segundo.	af872113-4dcd-412f-be3b-79f817057a77	2-0-1-1
490aad7e-7b49-41b2-b008-6f14ff23f070	1acaf7c1-ce85-4102-8b69-c0dbce8dfc11	Plancha Abdominal Estática (Plank)	3	45	0	60	Cuerpo alineado, retroversión pélvica y abdomen firme.	af872113-4dcd-412f-be3b-79f817057a77	00000
123d452c-f4f3-4c9a-98cf-b4d1a5852565	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano con Barra	4	8	30	120	Retracción escapular activa y apóyate bien en los pies.	3b9f6a00-6ce6-47cd-83ad-03b42d40346e	2-0-1-0
c61fd818-1d03-4195-a2e1-73fb7526bf32	af157a69-7232-462e-a23f-42afe6ba47ae	Press Inclinado con Mancuernas	3	10	30	90	Banco a 30°-45°. Bajar controlado abriendo el pecho.	3b9f6a00-6ce6-47cd-83ad-03b42d40346e	2-0-1-0
239b05f7-742d-4ce2-8d3e-e675ecd2fe52	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Mancuernas	3	8	20	90	Contrae glúteos y abdomen para estabilizar la columna.	3b9f6a00-6ce6-47cd-83ad-03b42d40346e	2-0-1-0
c830f9ba-fcaf-4f19-8c90-24eb1fff6a34	41a4b7cc-0b50-4126-b940-eae25d003b50	Elevaciones Laterales con Mancuernas	3	15	10	60	Elevar en el plano escapular sin balancear el torso.	3b9f6a00-6ce6-47cd-83ad-03b42d40346e	2-0-1-1
50b7d5c6-7b62-4c02-bac6-42fc2cabdcca	9596f153-4b63-44ac-92cc-9961a4104690	Extensión de Tríceps en Polea Alta con Cuerda	3	12	30	60	Codos pegados al cuerpo, buscar máxima extensión abajo.	3b9f6a00-6ce6-47cd-83ad-03b42d40346e	2-0-1-1
5b6ee551-f09d-47d0-9945-680fdea34c56	b8f39395-319f-49da-b53e-aa1b2da08742	Abducciones de Cadena en Máquina / Polea	3	10	50	90		3b9f6a00-6ce6-47cd-83ad-03b42d40346e	2-0-1-0
e2c91f0c-d6d3-4346-8db1-bb9132df103d	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90	Retracción escapular activa al iniciar el movimiento.	57787b16-62c4-45cf-9882-c75d595a71cd	2-0-1-0
2ecc9ca2-1f72-47cf-9ca0-85fac4d8ac40	0108d8b1-a26a-4e50-bf82-fe638031bd1e	Remo con Barra T o Barra Libre	4	8	40	90	Torso a 45°, llevar la barra hacia el ombligo.	57787b16-62c4-45cf-9882-c75d595a71cd	2-0-1-0
206ed081-ad2b-4bfc-b619-e863e33ee149	ac5b0f41-d73c-4d3d-916a-1d0053fc46f3	Jalón al Pecho en Polea	3	12	30	60	Traccionar guiando con los codos hacia abajo y atrás.	57787b16-62c4-45cf-9882-c75d595a71cd	2-0-1-1
f376e0a3-7551-448c-8051-8761a0eb08a1	52e4e02e-a17f-4e59-98d8-b8726929937c	Face Pull en Polea	3	15	12	60	Enfoque en deltoides posterior y salud articular del hombro.	57787b16-62c4-45cf-9882-c75d595a71cd	2-0-1-1
72c9fb29-b907-41ce-b6e9-9c172f8104b2	783224e8-79f2-4539-8e2b-b6496de30e75	Curl de Bíceps con Barra EZ / Mancuernas	3	10	30	60	Mantener los codos inmóviles al costado del torso.	57787b16-62c4-45cf-9882-c75d595a71cd	2-0-1-0
d176944a-7d1b-452e-8231-0c8da6638dc3	1a66acaa-1e55-4169-bdee-950317e6215b	Sentadilla Trasera con Barra (Back Squat)	4	8	30	120	Bajar manteniendo la alineación de las rodillas con la punta del pie.	a80b0922-2a5d-44a6-a583-b7ccfd5377d0	2-1-1-0
cb3fe6a1-8992-4dc9-ae5a-f9484f778de1	27be7347-67b6-4fa4-bf04-bf6b4dd907f8	Peso Muerto Rumano (RDL)	3	10	20	90	Llevar la cadera atrás manteniendo la espalda completamente neutra.	a80b0922-2a5d-44a6-a583-b7ccfd5377d0	3-0-1-0
c1a6fbf8-4d8f-44a8-a0e3-a1d85688b2bd	0105a89f-68a4-4739-ad21-39ae7b797c56	Prensa 45° (Leg Press)	3	12	50	90	Pies bien apoyados, no bloquear rodillas en la extensión máxima.	a80b0922-2a5d-44a6-a583-b7ccfd5377d0	2-0-1-0
b8215009-e7bb-40ab-8112-dcb9a0a47267	39ae0b69-6959-4d7a-951a-298567a48495	Hip Thrust con Barra	3	12	15	90	Apriete fuerte de glúteos arriba durante 1 segundo.	a80b0922-2a5d-44a6-a583-b7ccfd5377d0	2-0-1-1
b885988a-c87c-4f51-891e-58140711d3e5	1acaf7c1-ce85-4102-8b69-c0dbce8dfc11	Plancha Abdominal Estática (Plank)	3	45	0	60	Cuerpo alineado, retroversión pélvica y abdomen firme.	a80b0922-2a5d-44a6-a583-b7ccfd5377d0	00000
0cc97d87-ac5b-4655-9769-8f98518f53e6	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano con Barra	4	8	30	120	Retracción escapular activa y apóyate bien en los pies.	fdcf108b-87f7-415f-944f-65735529f5e3	2-0-1-0
14247eb7-80a5-4045-88f9-bbef821c5fe1	af157a69-7232-462e-a23f-42afe6ba47ae	Press Inclinado con Mancuernas	3	10	30	90	Banco a 30°-45°. Bajar controlado abriendo el pecho.	fdcf108b-87f7-415f-944f-65735529f5e3	2-0-1-0
6176cf7c-6f4c-4ad5-99b2-84549dc95960	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Mancuernas	3	8	20	90	Contrae glúteos y abdomen para estabilizar la columna.	fdcf108b-87f7-415f-944f-65735529f5e3	2-0-1-0
f638139e-b091-40e3-b92e-2a19d76216dc	41a4b7cc-0b50-4126-b940-eae25d003b50	Elevaciones Laterales con Mancuernas	3	15	10	60	Elevar en el plano escapular sin balancear el torso.	fdcf108b-87f7-415f-944f-65735529f5e3	2-0-1-1
e3b6a144-1d4a-46de-be86-baaaaee05f6a	9596f153-4b63-44ac-92cc-9961a4104690	Extensión de Tríceps en Polea Alta con Cuerda	3	12	30	60	Codos pegados al cuerpo, buscar máxima extensión abajo.	fdcf108b-87f7-415f-944f-65735529f5e3	2-0-1-1
841dc615-1255-4151-b2a7-73655b6b83af	b8f39395-319f-49da-b53e-aa1b2da08742	Abducciones de Cadena en Máquina / Polea	3	10	50	90		fdcf108b-87f7-415f-944f-65735529f5e3	2-0-1-0
45625edf-f70b-4de7-8bdb-25f59c6335ce	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90	Retracción escapular activa al iniciar el movimiento.	8d35a31e-486f-4343-ab7c-8d2cfcd05047	2-0-1-0
935cf9de-e2dd-4f3b-bfdf-078da598c299	0108d8b1-a26a-4e50-bf82-fe638031bd1e	Remo con Barra T o Barra Libre	4	8	40	90	Torso a 45°, llevar la barra hacia el ombligo.	8d35a31e-486f-4343-ab7c-8d2cfcd05047	2-0-1-0
c2093c51-6885-4686-9c9e-70bd551f1407	ac5b0f41-d73c-4d3d-916a-1d0053fc46f3	Jalón al Pecho en Polea	3	12	30	60	Traccionar guiando con los codos hacia abajo y atrás.	8d35a31e-486f-4343-ab7c-8d2cfcd05047	2-0-1-1
6a9f9ee5-57a8-48f6-8c7b-48f26df209ac	52e4e02e-a17f-4e59-98d8-b8726929937c	Face Pull en Polea	3	15	12	60	Enfoque en deltoides posterior y salud articular del hombro.	8d35a31e-486f-4343-ab7c-8d2cfcd05047	2-0-1-1
d660b8ef-4517-4cc7-8145-2c98c7f72a9c	783224e8-79f2-4539-8e2b-b6496de30e75	Curl de Bíceps con Barra EZ / Mancuernas	3	10	30	60	Mantener los codos inmóviles al costado del torso.	8d35a31e-486f-4343-ab7c-8d2cfcd05047	2-0-1-0
26c0f50f-5a5b-4359-bbd7-e482bb7a6312	1a66acaa-1e55-4169-bdee-950317e6215b	Sentadilla Trasera con Barra (Back Squat)	4	8	30	120	Bajar manteniendo la alineación de las rodillas con la punta del pie.	1f082a38-5a01-4dcb-bb06-633cbec21d59	2-1-1-0
f9610d90-9214-4012-be42-28ddd441fe95	27be7347-67b6-4fa4-bf04-bf6b4dd907f8	Peso Muerto Rumano (RDL)	3	10	20	90	Llevar la cadera atrás manteniendo la espalda completamente neutra.	1f082a38-5a01-4dcb-bb06-633cbec21d59	3-0-1-0
bb601732-67af-43e6-934f-09635ee62219	0105a89f-68a4-4739-ad21-39ae7b797c56	Prensa 45° (Leg Press)	3	12	50	90	Pies bien apoyados, no bloquear rodillas en la extensión máxima.	1f082a38-5a01-4dcb-bb06-633cbec21d59	2-0-1-0
87c50a53-110e-43b3-9529-c7c1d903ec66	39ae0b69-6959-4d7a-951a-298567a48495	Hip Thrust con Barra	3	12	15	90	Apriete fuerte de glúteos arriba durante 1 segundo.	1f082a38-5a01-4dcb-bb06-633cbec21d59	2-0-1-1
c0fb77de-2d16-471e-82a8-bc46413daf14	1acaf7c1-ce85-4102-8b69-c0dbce8dfc11	Plancha Abdominal Estática (Plank)	3	45	0	60	Cuerpo alineado, retroversión pélvica y abdomen firme.	1f082a38-5a01-4dcb-bb06-633cbec21d59	00000
68a56d72-7c45-4214-a0db-6014ea504d9b	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano con Barra	4	8	30	120	Retracción escapular activa y apóyate bien en los pies.	0d9e19b7-1160-452d-870e-96fd7228b11d	2-0-1-0
80614f7f-cdd6-490d-91fe-76b13d274eb6	af157a69-7232-462e-a23f-42afe6ba47ae	Press Inclinado con Mancuernas	3	10	30	90	Banco a 30°-45°. Bajar controlado abriendo el pecho.	0d9e19b7-1160-452d-870e-96fd7228b11d	2-0-1-0
6b0b50a4-116a-4dcf-97f7-a0c130ebb844	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Mancuernas	3	8	20	90	Contrae glúteos y abdomen para estabilizar la columna.	0d9e19b7-1160-452d-870e-96fd7228b11d	2-0-1-0
7d75b49f-4818-4d94-94c0-985101e93a65	41a4b7cc-0b50-4126-b940-eae25d003b50	Elevaciones Laterales con Mancuernas	3	15	10	60	Elevar en el plano escapular sin balancear el torso.	0d9e19b7-1160-452d-870e-96fd7228b11d	2-0-1-1
ec7a53ed-df56-47f5-98a1-0e196855db7d	9596f153-4b63-44ac-92cc-9961a4104690	Extensión de Tríceps en Polea Alta con Cuerda	3	12	30	60	Codos pegados al cuerpo, buscar máxima extensión abajo.	0d9e19b7-1160-452d-870e-96fd7228b11d	2-0-1-1
1c7a2964-b904-44da-96e2-1931d635ea47	b8f39395-319f-49da-b53e-aa1b2da08742	Abducciones de Cadena en Máquina / Polea	3	10	50	90		0d9e19b7-1160-452d-870e-96fd7228b11d	2-0-1-0
b46a28dc-195b-47f8-aacd-2ce79bf0f044	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	90	Retracción escapular activa al iniciar el movimiento.	df1d8c5a-f63c-45d7-a6ea-e6d17fa0e78f	2-0-1-0
1a642e02-1e21-4b49-835f-4d5cead859e6	0108d8b1-a26a-4e50-bf82-fe638031bd1e	Remo con Barra T o Barra Libre	4	8	40	90	Torso a 45°, llevar la barra hacia el ombligo.	df1d8c5a-f63c-45d7-a6ea-e6d17fa0e78f	2-0-1-0
da03e863-1033-421d-bb1c-84c9f6908495	ac5b0f41-d73c-4d3d-916a-1d0053fc46f3	Jalón al Pecho en Polea	3	12	30	60	Traccionar guiando con los codos hacia abajo y atrás.	df1d8c5a-f63c-45d7-a6ea-e6d17fa0e78f	2-0-1-1
7e8a365a-107e-4d0b-b166-a23ec24b9810	52e4e02e-a17f-4e59-98d8-b8726929937c	Face Pull en Polea	3	15	12	60	Enfoque en deltoides posterior y salud articular del hombro.	df1d8c5a-f63c-45d7-a6ea-e6d17fa0e78f	2-0-1-1
22def403-45e5-472a-974c-0940dce44c44	783224e8-79f2-4539-8e2b-b6496de30e75	Curl de Bíceps con Barra EZ / Mancuernas	3	10	30	60	Mantener los codos inmóviles al costado del torso.	df1d8c5a-f63c-45d7-a6ea-e6d17fa0e78f	2-0-1-0
39b7d28f-3727-4f63-92e5-8a1fbfcf7e32	1a66acaa-1e55-4169-bdee-950317e6215b	Sentadilla Trasera con Barra (Back Squat)	4	8	30	120	Bajar manteniendo la alineación de las rodillas con la punta del pie.	d814cbc4-54cc-473a-bd04-9539182eae35	2-1-1-0
5d1a1c8c-61ba-4fb7-bd7e-f36aa4fca0f9	27be7347-67b6-4fa4-bf04-bf6b4dd907f8	Peso Muerto Rumano (RDL)	3	10	20	90	Llevar la cadera atrás manteniendo la espalda completamente neutra.	d814cbc4-54cc-473a-bd04-9539182eae35	3-0-1-0
813717e6-73df-49c5-88cc-773a29d037b9	0105a89f-68a4-4739-ad21-39ae7b797c56	Prensa 45° (Leg Press)	3	12	50	90	Pies bien apoyados, no bloquear rodillas en la extensión máxima.	d814cbc4-54cc-473a-bd04-9539182eae35	2-0-1-0
2bc975a7-759b-4441-96ac-0548b5f0358e	39ae0b69-6959-4d7a-951a-298567a48495	Hip Thrust con Barra	3	12	15	90	Apriete fuerte de glúteos arriba durante 1 segundo.	d814cbc4-54cc-473a-bd04-9539182eae35	2-0-1-1
60c6e77f-e6a7-4259-a3ae-19fbc4051e26	1acaf7c1-ce85-4102-8b69-c0dbce8dfc11	Plancha Abdominal Estática (Plank)	3	45	0	60	Cuerpo alineado, retroversión pélvica y abdomen firme.	d814cbc4-54cc-473a-bd04-9539182eae35	00000
\.


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, nombre, "grupoMuscularPrincipal", "zonasTrabajadas", descripcion, "videoUrl", "createdAt", "updatedAt") FROM stdin;
28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano con Barra	Pecho	["Pectoral Mayor","Tríceps Braquial","Deltoides Anterior"]	Espalda apoyada con leve arco lumbar fisiológico, retracción escapular activa y pies firmes en el suelo. Bajar la barra de forma controlada hasta la parte media del esternón y empujar extendiendo brazos sin perder la posición escapular.	https://youtu.be/ZxDku9A3mRg	2026-10-13 20:18:54.868019	2026-11-20 19:08:54.748633
af157a69-7232-462e-a23f-42afe6ba47ae	Press Inclinado con Mancuernas	Pecho	["Pectoral Mayor (Porción Clavicular)","Deltoides Anterior","Tríceps Braquial"]	Ajustar el banco a 30°-45°. Bajar las mancuernas al costado del pecho alto manteniendo codos a unos 45° del torso. Empujar hacia arriba juntando ligeramente las mancuernas al final sin bloquear codos bruscamente.	https://www.youtube.com/shorts/-zbesyTNztQ	2026-10-17 16:40:10.969009	2026-10-17 16:40:10.969009
78a4423c-69de-4452-9889-68d32518be09	Cruce de Poleas / Flyes en Polea	Pecho	["Pectoral Mayor","Pectoral Menor"]	Mantener una ligera flexión de codos constante durante todo el recorrido. Dar un paso al frente para tensionar la polea, juntar las manos al frente apretando el pecho al final del movimiento y abrir de manera controlada.	https://www.youtube.com/shorts/I-Ue34qLxc4	2026-10-17 16:55:09.906287	2026-10-17 16:55:09.906287
350855eb-db75-410e-a1f8-ababf961c7e3	Fondos en Paralelas (Dips para Pecho)	Pecho	["Pectoral Mayor (Porción Inferior)","Tríceps Braquial","Deltoides Anterior"]	Inclinarse ligeramente hacia adelante para dar mayor énfasis al pecho. Bajar hasta que los hombros queden alineados con los codos y empujar hacia arriba hasta extender los brazos.	https://www.youtube.com/shorts/YMf0VNtMijw	2026-10-17 17:40:16.878983	2026-10-17 17:40:16.878983
3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	Brazos	["Tríceps Braquial","Pectoral Menor","Deltoides Anterior"]	Sostenerse en barras paralelas. Flexionar codos hasta 90 grados con el torso ligeramente inclinado y empujar con fuerza hasta la extensión completa.	https://www.youtube.com/watch?v=sM6XUdt1rm4	2026-10-13 20:18:54.927363	2026-10-13 21:06:28.516841
f4d99b32-7dfd-459e-9932-d109455f602d	Remo Gironda (Polea Baja)	Espalda	["Romboides","Trapecio Medio","Dorsal Ancho","Erectores Espinales"]	Espalda erguida y rodillas con leve flexión. Traccionar el agarre hacia el abdomen manteniendo codos pegados al cuerpo y sacando pecho en la fase de máxima contracción.	https://www.youtube.com/shorts/I3Wi6GK0QMk	2026-10-17 19:05:02.046382	2026-10-17 19:05:02.046382
52e4e02e-a17f-4e59-98d8-b8726929937c	Face Pull en Polea	Hombros	["Deltoides Posterior","Romboides","Manguito Rotador"]	Para Face Pull, traccionar la cuerda hacia la altura de la cara/frente, separando las manos y rotando los hombros hacia afuera al final del recorrido.	https://www.youtube.com/shorts/Ue0xtLb_kvM	2026-10-17 19:19:35.06584	2026-10-17 19:19:35.06584
783224e8-79f2-4539-8e2b-b6496de30e75	Curl de Bíceps con Barra EZ / Mancuernas	Brazos	["Bíceps Braquial","Braquial Anterior"]	Codos fijos a los costados del cuerpo. Flexionar los antebrazos hacia arriba sin mover el torso ni adelantar los codos en exceso. Bajar de manera fluida y controlada.	https://www.youtube.com/shorts/l-BPupny6cM	2026-10-17 19:40:01.630715	2026-10-17 19:40:01.630715
0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Mancuernas	Hombros	["Deltoides Anterior","Deltoides Lateral","Core","Tríceps Braquial"]	Desde la altura de las clavículas, empujar la barra/mancuernas de manera vertical por encima de la cabeza. Activar glúteos y abdomen para no hiperextender la zona lumbar.	https://www.youtube.com/shorts/DdITN8U-kFI	2026-10-13 20:18:54.904812	2026-10-17 19:11:52.062997
083ccd8d-0b79-4a11-9180-2d9591a94136	Curl Martillo con Mancuernas	Brazos	["Braquiorradial","Braquial Anterior","Bíceps Braquial"]	Agarre neutro (palmas enfrentadas). Flexionar los brazos manteniendo las muñecas firmes, ideal para ganar grosor en el antebrazo y brazo.	https://www.youtube.com/shorts/PzmSQcFSNPI	2026-10-17 19:42:43.824227	2026-10-17 19:42:43.824227
f6d571ee-7710-459c-ad99-2652a2491c13	Press de Banca Plano	Pecho	["Pectoral Mayor","Tríceps Braquial","Deltoides Anterior"]	Tumbado en banco plano con 5 puntos de apoyo (pies, glúteo, escápulas y cabeza). Retracción escapular, descenso controlado de la barra al tercio medio del esternón y empuje concéntrico vertical.	https://www.youtube.com/shorts/UgmYbrytasw	2026-10-17 18:07:27.093909	2026-10-17 18:07:27.093909
4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	Espalda	["Dorsal Ancho","Trapecio (Inferior/Medio)","Romboides","Bíceps Braquial"]	Agarre en pronación ligeramente más ancho que los hombros. Iniciar el movimiento retrayendo las escápulas y llevando el pecho hacia la barra. Bajar de forma controlada hasta extender los brazos por completo.	https://www.youtube.com/watch?v=sPej2dr2J5s	2026-10-13 23:44:58.179212	2026-10-17 18:07:27.187552
ac5b0f41-d73c-4d3d-916a-1d0053fc46f3	Jalón al Pecho en Polea	Espalda	["Dorsal Ancho","Redondo Mayor","Bíceps Braquial"]	Sentarse firmemente asegurando los muslos bajo los rodillos. Inclinarse levemente hacia atrás y traccionar la barra hacia la parte alta del pecho guiando con los codos hacia abajo y atrás.	https://www.youtube.com/shorts/TcYwpzaRS1I	2026-10-17 18:43:02.311492	2026-10-17 18:43:02.311492
0108d8b1-a26a-4e50-bf82-fe638031bd1e	Remo con Barra T o Barra Libre	Espalda	["Dorsal Ancho","Romboides","Trapecio Medio","Erectores Espinales"]	Inclinación del torso a 45° manteniendo la columna neutra y rodillas flexionadas. Llevar la barra hacia el ombligo o la parte baja del abdomen apretando la espalda arriba.	https://www.youtube.com/shorts/pmJKV0pfI3M	2026-10-17 18:59:06.458878	2026-10-17 19:01:38.598013
41a4b7cc-0b50-4126-b940-eae25d003b50	Elevaciones Laterales con Mancuernas	Hombros	["Deltoides Lateral"]	Elevar los brazos hacia los costados en el plano escapular (ligeramente hacia adelante) hasta la altura de los hombros. Evitar balanceos con el cuerpo y controlar la bajada.	https://www.youtube.com/shorts/Vh_Kjw3O-DQ	2026-10-17 19:13:01.855493	2026-10-17 19:14:40.565191
f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	Espalda	["Isquiotibiales","Glúteo Mayor","Erectores Espinales","Dorsal Ancho"]	Barra pegada a las tibias. Agarre en pronación al ancho de hombros. Empujar el suelo con los pies extendiendo rodillas y caderas al unísono manteniendo la espalda en posición anatómica neutra.	https://youtu.be/aT-F-mhLfAY	2026-10-13 20:18:54.893105	2026-11-20 19:08:18.704546
9aa2109b-c433-446d-90b4-d23a19620d3e	Elevaciones Laterales con Polea	Hombros	["Deltoides Lateral"]	Elevar los brazos hacia los costados en el plano escapular (ligeramente hacia adelante) hasta la altura de los hombros. Evitar balanceos con el cuerpo y controlar la bajada.	https://www.youtube.com/shorts/SaoW-iSUxfk	2026-10-17 19:16:37.54405	2026-10-17 19:16:37.54405
9596f153-4b63-44ac-92cc-9961a4104690	Extensión de Tríceps en Polea Alta con Cuerda	Brazos	["Tríceps Braquial (Cabeza Lateral)","Tríceps Braquial (Cabeza Media)"]	Codos pegados a los costados. Empujar la cuerda hacia abajo extendiendo los brazos por completo y separando las puntas de la cuerda al final.	https://www.youtube.com/shorts/qdRDkVqVeOY	2026-10-17 19:44:45.894748	2026-10-17 19:44:45.894748
056c459e-dc81-4cbb-9f07-74b587fa6222	Press Francés con Barra EZ	Brazos	["Tríceps Braquial (Cabeza Larga)"]	Acostado en banco plano, flexionar únicamente los codos llevando la barra hacia la frente/coronilla de forma segura y extender de nuevo a la posición inicial.	https://www.youtube.com/shorts/L3bEz-vcdGU	2026-10-17 19:51:51.554909	2026-10-17 19:51:51.554909
1a66acaa-1e55-4169-bdee-950317e6215b	Sentadilla Trasera con Barra (Back Squat)	Piernas	["Cuádriceps","Glúteo Mayor","Aductores","Erectores Espinales"]	Colocar la barra sobre el trapecio. Descender rompiendo la cadera hacia atrás y abajo manteniendo rodillas alineadas con la punta de los pies. Mantener el torso firme y subir empujando con toda la planta del pie.	https://www.youtube.com/shorts/dW3zj79xfrc	2026-10-17 19:54:19.808832	2026-10-17 19:54:19.808832
0105a89f-68a4-4739-ad21-39ae7b797c56	Prensa 45° (Leg Press)	Piernas	["Cuádriceps","Glúteo Mayor","Isquiotibiales"]	Apoyar la espalda y cadera firmes contra el respaldo. Flexionar rodillas hacia el pecho manteniendo la planta de los pies firme en la plataforma y extender sin bloquear las rodillas al final.	https://www.youtube.com/shorts/4k8GkDBTrXE	2026-10-17 19:56:03.793322	2026-10-17 19:56:03.793322
eddc756a-54fb-4f13-816c-35aa28da0266	Extensión de Cuádriceps en Máquina	Piernas	["Cuádriceps"]	Ajustar el rodillo sobre los tobillos. Extender las piernas de forma fluida apretando el cuádriceps arriba un segundo y descendiendo de manera controlada.	https://www.youtube.com/shorts/N-euKPQgO84	2026-10-17 19:57:29.390362	2026-10-17 19:57:29.390362
27be7347-67b6-4fa4-bf04-bf6b4dd907f8	Peso Muerto Rumano (RDL)	Piernas	["Glúteo Mayor","Isquiotibiales","Erectores Espinales"]	Mantener la barra pegada a los muslos, llevar la cadera hacia atrás con una ligera flexión de rodillas fija. Bajar hasta sentir la tensión en la parte posterior del muslo manteniendo la espalda totalmente recta.	https://www.youtube.com/shorts/EiyvxSP-keA	2026-10-17 19:59:41.418181	2026-10-17 19:59:41.418181
63dacb33-324c-4ae9-b754-7626af164db2	Curl Femoral Tumbado	Piernas	["Isquiotibiales"]	Ajustar la máquina para que el eje coincida con la rodilla. Flexionar las piernas llevando el rodillo hacia el glúteo y controlar el retorno sin hiperextender.	https://www.youtube.com/shorts/ENDnSAkatcw	2026-10-17 20:02:46.359671	2026-10-17 20:02:46.359671
c523e75f-5049-43d9-8c61-ce1801c1e330	Zancadas / Estocadas (Lunges)	Piernas	["Cuádriceps","Glúteo Mayor","Isquiotibiales","Aductores"]	Dar un paso largo hacia adelante o atrás bajando la rodilla trasera hacia el suelo en un ángulo de 90°. Mantener el torso erguido y empujar con la pierna delantera para volver.	https://www.youtube.com/shorts/8h4nhwC-tHU	2026-10-17 20:05:15.45885	2026-10-17 20:05:15.45885
d9225ac4-5b24-4bc6-87f7-92bad04dc3ba	Elevación de Talones en Máquina (Gemelos de Pie / Sentado)	Piernas	["Gastrocnemio","Sóleo"]	Apoyar el metatarso en el borde del escalón. Bajar los talones para lograr un estiramiento completo y elevar empujando con la punta de los pies en máxima contracción.	https://www.youtube.com/shorts/HfKfOT9R9D0	2026-10-17 20:08:29.730642	2026-10-17 20:08:29.730642
39ae0b69-6959-4d7a-951a-298567a48495	Hip Thrust con Barra	Glúteos	["Glúteo Mayor","Glúteo Medio","Isquiotibiales","Cuádriceps"]	Apoyar la escápula en un banco, colocar la barra sobre la pelvis. Empujar con los talones elevando la cadera hasta alinearla con los hombros y rodillas, apretando fuerte los glúteos arriba y manteniendo la mirada al frente.	https://www.youtube.com/shorts/NjnHOVJA690	2026-10-17 20:11:04.184395	2026-10-17 20:11:04.184395
143705a5-12e3-4efa-91d3-8355637e4ab3	Patada de Glúteo en Polea o Máquina	Glúteos	["Glúteo Mayor","Glúteo Medio"]	Ajustar la tobillera en la polea baja. Llevar la pierna extendida hacia atrás empujando con el talón de forma fluida sin arquear en exceso la zona lumbar.	https://www.youtube.com/shorts/-YgMavu-_XQ	2026-10-17 20:12:39.795267	2026-10-17 20:12:39.795267
b8f39395-319f-49da-b53e-aa1b2da08742	Abducciones de Cadena en Máquina / Polea	Glúteos	["Glúteo Medio","Glúteo Menor"]	Sentado o de pie, empujar hacia afuera separando las piernas. Ideal para el desarrollo del lateral de la cadera.	https://www.youtube.com/shorts/zXRSm0_icfc	2026-10-17 20:13:43.028274	2026-10-17 20:13:43.028274
1acaf7c1-ce85-4102-8b69-c0dbce8dfc11	Plancha Abdominal Estática (Plank)	Core	["Transverso del Abdomen","Recto Abdominal","Oblicuos","Erectores Espinales"]	Apoyo sobre antebrazos y puntas de pie. Mantener el cuerpo totalmente alineado como una tabla, retroversión pélvica activa y abdomen apretado sin dejar caer la cadera	https://www.youtube.com/shorts/3AM7L2k7BEw	2026-10-17 20:15:37.58167	2026-10-17 20:15:37.58167
31d04ef9-7b9f-40da-9d35-6f1b8c03474b	Elevación de Piernas Colgado	Core	["Recto Abdominal","Oblicuos","Flexores de Cadera"]	Colgado de la barra de dominadas, elevar las piernas o rodillas hacia el pecho de forma controlada sin usar el impulso ni balancearse.	https://www.youtube.com/shorts/98oNxE56i3g	2026-10-17 20:17:45.616379	2026-10-17 20:17:45.616379
274c2fed-6e55-45b0-b2d6-8316187e01fe	Rueda Abdominal (Ab Wheel Rollout)	Core	["Recto Abdominal","Transverso del Abdomen","Dorsal Ancho"]	Desde posición de hinojos, rodar la rueda hacia adelante extendiendo el cuerpo progresivamente mientras el abdomen se mantiene contraído. Regresar usando la fuerza central.	https://www.youtube.com/shorts/MinlHnG7j4k	2026-10-17 20:21:16.240216	2026-10-17 20:21:16.240216
66f393de-8bd7-453f-92be-ba29c742ca1c	Crunch Abdominal en Polea Alta	Core	["Recto Abdominal"]	Arrodillado frente a la polea alta con la cuerda colocada al lado de la cabeza. Flexionar el tronco hacia las rodillas apretando la faja abdominal de manera aislada.	https://www.youtube.com/shorts/XuQWMR4QKF0	2026-10-17 20:22:13.153707	2026-10-17 20:22:13.153707
a70f7bca-69fc-472d-b84a-d47ef675991a	Burpees	Cardio / Full Body	["Cuádriceps","Pectoral Mayor","Deltoides Anterior","Core"]	Desde posición de pie, bajar a posición de flexión, tocar el pecho con el suelo, volver explosivamente con los pies hacia adelante y realizar un salto vertical con aplauso arriba.	https://www.youtube.com/shorts/Iv7MXi_1Trc	2026-10-17 20:41:08.556505	2026-10-17 20:41:08.556505
cd7e4c02-4a0c-4832-b12e-56381ad4e513	Kettlebell Swing	Cardio / Full Body	["Glúteo Mayor","Isquiotibiales","Erectores Espinales","Deltoides"]	Movimiento explosivo dominado por la bisagra de cadera. Pasar la pesa entre las piernas hacia atrás y proyectar la cadera con potencia para balancearla a la altura de los hombros.	https://www.youtube.com/shorts/P-dbz0nxupg	2026-10-17 20:42:49.223903	2026-10-17 20:42:49.223903
9c3394cd-ed7c-4cbe-b040-b52945b60e23	Remo Ergómetro (Rowing Machine)	Cardio / Full Body	["Dorsal Ancho","Cuádriceps","Isquiotibiales","Bíceps Braquial","Core"]	Iniciar el empuje con las piernas, luego inclinar levemente el torso hacia atrás y finalmente traccionar con los brazos hasta tocar las costillas inferiores.	https://www.youtube.com/shorts/ssTIVEpsMRY	2026-10-17 20:44:24.065974	2026-10-17 20:44:24.065974
232491fb-f91f-4ec2-b1bc-56e7e273d23a	Slam Ball (Lanzamiento de Balón Medicinal)	Cardio / Full Body	["Core","Deltoides","Dorsal Ancho","Cuádriceps"]	Levantar el balón por encima de la cabeza extendiendo todo el cuerpo y lanzarlo con máxima potencia contra el suelo contrayendo todo el core.	https://www.youtube.com/shorts/cgKqNn90MEo	2026-10-17 20:46:30.456277	2026-10-17 20:46:30.456277
c8bfcad1-53b0-47bd-89a0-98a729967603	Press Militar con Barra	Hombros	["Deltoides Anterior","Deltoides Lateral","Tríceps","Core"]	De pie con abdomen y glúteos contraídos. Barra apoyada sobre clavículas, empujar verticalmente por delante del rostro hasta bloquear codos sobre la cabeza.	https://youtu.be/jQ3pOfyYqyo	2026-10-19 16:22:21.570054	2026-11-20 19:09:23.254707
787ae260-661c-4378-b93d-114fb33f5779	Sentadilla Profunda	Piernas	["Cuádriceps","Glúteo Mayor","Core","Aductores"]	Pies al ancho de hombros con puntas ligeramente hacia afuera. Flexión simultánea de cadera y rodillas descendiendo por debajo del paralelo, manteniendo columna neutra y pecho erguido.	https://youtu.be/vJB01C7LUHk	2026-10-19 16:22:21.159346	2026-11-20 19:09:59.832375
\.


--
-- Data for Name: logged_sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logged_sets (id, "exerciseId", "exerciseName", "setNumber", "actualReps", "actualWeightKg", "isCompleted", "sessionId") FROM stdin;
6366d302-2124-4e8e-b4c6-f47bb5015d95	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	70	t	506a1d38-4fde-4e5c-ad2d-739ed2bd89bf
1873495e-716e-44f8-a568-9827823de6eb	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	70	t	506a1d38-4fde-4e5c-ad2d-739ed2bd89bf
5fc96077-fbab-49f1-bad6-304660cb966b	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	60	t	506a1d38-4fde-4e5c-ad2d-739ed2bd89bf
a663c8fc-5b90-44fc-8b0c-bd8c8c3bf954	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	75	t	ec879803-034b-4925-b2a7-acd7308d1996
6037a2c0-9a0a-4451-90dd-0a62498ea273	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	75	t	ec879803-034b-4925-b2a7-acd7308d1996
86856f87-6b03-4eb5-b139-f437a3f251c0	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	62.5	t	ec879803-034b-4925-b2a7-acd7308d1996
d6743150-e7f9-4ffe-89c4-1201232ce8c1	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	d33af983-2c78-4230-96bc-6400a0f19211
6dacd33e-8f75-4e29-af7d-fd2df244990d	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	d33af983-2c78-4230-96bc-6400a0f19211
a4c0e5eb-db43-452a-a3f2-9ca7ba877083	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	t	d33af983-2c78-4230-96bc-6400a0f19211
e70d88ea-604e-4ca9-9a6b-d7cd2f134a01	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	179e0f90-e8fb-41c1-9db7-b8a274453851
1a23ed4d-ce91-4d44-adbf-f41463d46c46	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	179e0f90-e8fb-41c1-9db7-b8a274453851
40cf5b64-2fe3-40aa-94fb-980119a617b1	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	3	8	80	t	179e0f90-e8fb-41c1-9db7-b8a274453851
6601a9f0-a430-497d-b7fa-2a193fc0dc93	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	t	179e0f90-e8fb-41c1-9db7-b8a274453851
a3097c59-3361-498d-b9ef-dcdb675815cd	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	f	179e0f90-e8fb-41c1-9db7-b8a274453851
79c0281a-eddb-4673-b96c-c1d97f65e532	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	2	10	65	f	179e0f90-e8fb-41c1-9db7-b8a274453851
e19462e9-4146-482e-b18b-03c7a6b18892	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	3	10	65	f	179e0f90-e8fb-41c1-9db7-b8a274453851
1efe8906-c73e-498d-8177-944228fa75b0	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	f	179e0f90-e8fb-41c1-9db7-b8a274453851
d03346a5-622c-4236-bfae-97a7301e1828	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
4624e0d4-5a8c-4a29-a680-41283327b257	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
616a6ba3-6499-4af5-86d6-6875652a6c77	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	3	8	80	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
ad4cecf9-1e4b-444a-a243-55d800e70082	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
e70ac0c3-c737-41a5-8daa-0c8f24f82432	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
fc8ea18e-2b99-44e1-a490-d5754fd46459	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	2	10	65	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
63eee55d-e909-4602-8219-083ad22ea543	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	3	10	65	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
b3b9e5b2-f927-40a3-92bb-28450536dde4	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	t	5ec718fc-d0b0-46c2-a8bc-981a68cae6d0
862ffd37-2f5a-4523-801a-9bf146ed8358	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	75fc0003-de1b-418f-8e35-19be7903c5eb
320fdf41-3a09-4443-b0fa-6da01f942ef5	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	75fc0003-de1b-418f-8e35-19be7903c5eb
ca509330-3b3a-4e64-989f-f68b9f6ce326	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	3	8	80	t	75fc0003-de1b-418f-8e35-19be7903c5eb
eb4c158a-f807-44f4-8efd-d83723c01ba3	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	t	75fc0003-de1b-418f-8e35-19be7903c5eb
c99a6c65-2603-4a99-80f3-90288b302382	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	t	75fc0003-de1b-418f-8e35-19be7903c5eb
9f480ced-3a09-46e5-9f73-b7fdbc844499	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	2	10	65	t	75fc0003-de1b-418f-8e35-19be7903c5eb
4cd786c2-919c-485c-aee8-a8add7f6382f	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	3	10	65	t	75fc0003-de1b-418f-8e35-19be7903c5eb
f371d2be-e5b0-4cfb-8835-3b82180a11e2	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	t	75fc0003-de1b-418f-8e35-19be7903c5eb
70230fd8-5f3a-46cd-9b1b-77a32306cdea	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
2102f750-7785-485a-ad49-4401a42e6ec2	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
1674feb4-e285-4963-aadd-80a0da630a8c	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	3	8	80	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
c513bf4f-7f52-4d1c-bf7a-e4873e9c4499	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
503d4e4a-61c6-4d08-acd0-18532e6a3216	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
1f068e82-4afd-4d94-9a15-61ef09582450	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	2	10	65	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
319566d1-cdc0-404b-b760-66b0b2da2d65	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	3	10	65	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
88a03937-2563-4799-bda3-8795a9221b73	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	t	9db9d31e-c1df-4cf9-84a5-631419b405b1
f937baa1-ab41-421e-a8f0-c8bbfb6093fd	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
8ea9d2d1-99cb-449c-8ccc-4611cd413509	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
ece54ac7-28bf-4d87-8aea-c9bb657351c7	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	3	8	80	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
48e331b1-3db4-4437-8e4d-c2cd7efc07fb	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
4cf0edbb-273f-4d33-a403-e6b87697fe78	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
0eac1a24-e1e2-48fe-936b-cb680e7ea7d5	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	2	10	65	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
4cfebc0d-29a3-4061-a157-1a4abf0b0431	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	3	10	65	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
825f82ae-d46c-47b1-9dc2-7647e8ddb560	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	t	ecfe460b-28a3-4ce5-ae59-e6065dbdfb84
b87e78c4-3633-4aa1-b81d-c11b382b5156	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	1	8	80	t	f5102b02-b23e-4637-be8a-3a4966f03a00
1b823122-c71c-442e-9f7b-e1b52f165d40	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	2	8	80	t	f5102b02-b23e-4637-be8a-3a4966f03a00
45b8654e-9155-4771-bdf1-2c48ff05e8bd	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	3	8	80	t	f5102b02-b23e-4637-be8a-3a4966f03a00
cce84580-3a21-4820-bc69-2c880af4497c	531448b1-2a30-4147-b9f7-d97fb80d36d8	Sentadilla Profunda	4	8	80	t	f5102b02-b23e-4637-be8a-3a4966f03a00
0693e728-cdc8-4f6d-aec6-412d02226387	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	1	10	65	t	f5102b02-b23e-4637-be8a-3a4966f03a00
464406a5-a092-4fdf-ad75-bf786d90c6fc	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	2	10	65	t	f5102b02-b23e-4637-be8a-3a4966f03a00
13457c77-4328-4ce0-9dfd-4ad1b84a05d1	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	3	10	65	t	f5102b02-b23e-4637-be8a-3a4966f03a00
8ca7e103-cd79-45b8-b24e-a39f6f80ca26	28d4f0c8-dd5c-4196-ad10-9d323abe85d7	Press de Banca Plano	4	10	65	t	f5102b02-b23e-4637-be8a-3a4966f03a00
6a3355fb-d5a2-4d60-b23f-305b82e8d57a	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	1	6	110	t	b4d58177-97f0-47b7-ac3f-caf6762f2892
532b1039-3960-47cb-a625-06519c46d416	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	2	6	110	t	b4d58177-97f0-47b7-ac3f-caf6762f2892
a5498aba-6a20-41e6-abb5-01f7050a74f9	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	3	6	110	f	b4d58177-97f0-47b7-ac3f-caf6762f2892
9a36feb0-b0dd-4e8a-ab4a-5c1619e5a1e8	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	1	10	45	t	b4d58177-97f0-47b7-ac3f-caf6762f2892
30beb658-37b6-4fd1-a954-fec8a7754e80	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	2	10	45	t	b4d58177-97f0-47b7-ac3f-caf6762f2892
17de0341-a773-44e6-b2bc-895a817b410a	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	3	10	45	f	b4d58177-97f0-47b7-ac3f-caf6762f2892
daa815f7-0015-4d88-89d8-29d049dfcc1c	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	1	6	110	t	9a6269e9-a18b-4e47-86d2-1f39bac67d57
76a68954-68ad-4a62-b4fc-4e7149c4cb03	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	2	6	110	t	9a6269e9-a18b-4e47-86d2-1f39bac67d57
9e3aa097-e5c4-4c29-ac65-ff70f491d20a	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	3	6	110	t	9a6269e9-a18b-4e47-86d2-1f39bac67d57
fd036b2f-8749-4aa3-af6e-0e7d53f12fe0	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	1	10	45	t	9a6269e9-a18b-4e47-86d2-1f39bac67d57
df4f555a-f037-42f8-847c-25befb457802	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	2	10	45	t	9a6269e9-a18b-4e47-86d2-1f39bac67d57
2c6161f6-13d6-47f0-b290-ca2d234a35a5	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	3	10	45	t	9a6269e9-a18b-4e47-86d2-1f39bac67d57
be5ae2b8-9391-4408-96a4-ba312307b93e	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	1	8	75	t	434d1bf4-c421-4cc5-974c-0f7d34968ec3
89f9592d-bac8-4920-a11f-90d657ee4bc2	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	2	8	75	t	434d1bf4-c421-4cc5-974c-0f7d34968ec3
69c9651b-9d13-44ab-9ab3-ffc2f4b41164	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	3	8	80	t	434d1bf4-c421-4cc5-974c-0f7d34968ec3
b004b8d1-04d8-48fa-b631-0b1ca0cfac1c	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	4	8	75	f	434d1bf4-c421-4cc5-974c-0f7d34968ec3
b026894e-5d5e-48aa-9a00-8bc3b66d4ac6	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	1	10	50	t	434d1bf4-c421-4cc5-974c-0f7d34968ec3
c30bddf3-56d9-4e67-b0b1-e93ba2506105	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	2	10	70	t	434d1bf4-c421-4cc5-974c-0f7d34968ec3
26633ead-1503-4b37-898e-72ee1774d057	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	3	10	50	f	434d1bf4-c421-4cc5-974c-0f7d34968ec3
372a95de-212f-4a74-bd8d-a859ad4b2fd2	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	1	10	60	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
65ff5ec9-a8ea-4e64-b9d3-52a4431a1192	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	2	10	60	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
f42fa2b8-5078-424c-8c54-fb781d19f0a8	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	3	10	60	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
483453d9-ee3f-48ec-8617-722b6b523470	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	4	10	60	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
0e26a2bb-df47-4ee7-87a6-e67d54c9e246	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	1	10	50	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
7a5a59fd-db87-41dc-9a06-f4d973328a6b	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	2	10	50	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
ee57f5c9-eca1-488d-912e-c31bfa00cf89	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	3	10	50	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
b6ff0e54-192b-4147-b8e0-0e751742d3cf	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	1	12	55	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
fbf93346-ef01-46de-919b-e26f38405110	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	2	12	55	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
e2283178-26e3-486c-9132-6f4c9205ec0e	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	3	12	55	t	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
32b0e2e0-e9ec-41c9-baec-b45244c817b1	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	4	12	55	f	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
4c9a4d06-8895-4b64-b50f-3cd0198ce43f	f9162763-b49a-4a3f-a171-015c823d7f19	Peso Muerto Convencional	5	12	55	f	8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3
2515fa51-1a22-4bbf-bc6d-d971b0a61055	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	1	8	75	t	13a92424-36fb-47e0-b3f5-1104a74b0ba4
b1ae8543-83a8-45cc-9956-2bcd3c555bae	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	2	8	75	t	13a92424-36fb-47e0-b3f5-1104a74b0ba4
0efa2ebf-3fb3-4440-a6f2-772f122785b8	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	3	8	75	t	13a92424-36fb-47e0-b3f5-1104a74b0ba4
1fb96e8a-c2ab-4a7d-bfb5-14b3e8a9a5da	b3ada3f4-4083-4770-9b11-a0cc13cb4dd6	Dominadas Pronas (Pull-ups)	4	8	75	t	13a92424-36fb-47e0-b3f5-1104a74b0ba4
4ad4eeae-50ea-4ea5-8294-d666051bed05	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	8	60	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
416a715a-5ed9-4514-806b-ec810aba24fd	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	8	60	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
8c36339e-527e-4b03-87ae-cd97ae3f1a9e	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	8	60	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
3b64d913-fe38-449d-b663-4cce0030aad3	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
42299a60-863a-4b5f-8059-baa99068a204	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	10	50	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
9782f9c7-cc09-43f6-8ebc-ce733225db36	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	10	50	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
765cec61-ec4b-4e56-b7a8-b7c1789bd56f	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	t	4d1d2135-c67f-4a3f-85ee-382201ae15d0
19bec579-b4dd-4df4-b8e9-5dfc770e759d	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	8	60	f	b39f2c32-4f89-43f7-a324-d9398021a20f
4ed6c685-0dde-4a48-a5ad-2a50f4f14a57	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	8	60	t	b39f2c32-4f89-43f7-a324-d9398021a20f
a4bea7d3-87e7-4fe1-87e3-032f8b9b3d03	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	8	60	t	b39f2c32-4f89-43f7-a324-d9398021a20f
a1ab56e3-c1ff-40e3-8d5d-2a7cda08ad37	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	f	b39f2c32-4f89-43f7-a324-d9398021a20f
6b10b555-079e-48f8-9c00-250c02ac3645	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	1	10	50	t	2bd01f9c-8d67-4661-93a0-f454f202a62d
0e53d1b1-2c1c-400a-a2ff-c69be557fc05	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	2	10	50	t	2bd01f9c-8d67-4661-93a0-f454f202a62d
2b860075-6c9f-413c-9b66-99d9e15f5eca	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	3	10	50	f	2bd01f9c-8d67-4661-93a0-f454f202a62d
b95c402f-5f41-4afc-abf7-c267fb1de35e	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	1	10	50	t	2bd01f9c-8d67-4661-93a0-f454f202a62d
1602a51f-4e9d-420a-9260-5efc2df689fe	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	2	10	50	t	2bd01f9c-8d67-4661-93a0-f454f202a62d
569fba7a-ae2d-42f2-8f98-4967e2fe310e	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	3	10	50	t	2bd01f9c-8d67-4661-93a0-f454f202a62d
769e57f7-8192-4b5e-a99e-47d4fee7d6ef	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	8	60	t	ede6d879-b5ce-40f5-b666-3aada1cd3e93
8cae08a7-4dcf-42ec-ba33-3f9025e3768c	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	8	60	t	ede6d879-b5ce-40f5-b666-3aada1cd3e93
3800b7c2-0bc4-46ce-bd24-6361e67bcde6	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	8	60	t	ede6d879-b5ce-40f5-b666-3aada1cd3e93
ced49b04-016d-47cf-8448-11b7805496cd	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	f	ede6d879-b5ce-40f5-b666-3aada1cd3e93
2aaeb038-abc8-4ba0-9000-0d748b11fa56	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	8	60	t	cdc1605c-423a-42f7-a527-ed615b98940f
23daf246-129a-464c-872b-34da54406c8e	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	8	60	t	cdc1605c-423a-42f7-a527-ed615b98940f
6d69ed33-2317-4126-a75b-8094ec36295d	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	8	60	t	cdc1605c-423a-42f7-a527-ed615b98940f
b87c99e6-c12e-41bd-872e-e2acab701890	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	t	cdc1605c-423a-42f7-a527-ed615b98940f
d22cc03f-6f75-4e3e-b3dc-9d932a459c64	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	1	10	70	t	d077fd9b-b653-4665-875b-9a546daecaf8
63f13cfa-2de7-4db8-83ea-5d915d0a3478	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	2	10	70	t	d077fd9b-b653-4665-875b-9a546daecaf8
93100035-1ef8-4d57-9541-f256d6148d10	0e3cf60d-3348-46fd-a37c-490b156b4a04	Press Militar con Barra	3	10	70	t	d077fd9b-b653-4665-875b-9a546daecaf8
7e467c91-ea09-42a2-9f8e-a7b9bdf9d2a3	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	1	10	50	t	d077fd9b-b653-4665-875b-9a546daecaf8
bf039375-2982-40f7-87bf-2a6a663aa720	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	2	10	50	t	d077fd9b-b653-4665-875b-9a546daecaf8
19b1d16f-bf5e-46c0-a2f4-355a1c6a9f44	3cc88512-3941-40f3-8be8-d8a04ca37362	Fondos en Paralelas (Dips)	3	10	50	t	d077fd9b-b653-4665-875b-9a546daecaf8
bd268016-1fbe-4156-ad36-763af3417742	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	8	60	t	e16c575f-7d3a-4d12-bec6-3cac9a232e70
ebb00990-1b7f-4f8c-8186-b13707a59623	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	8	60	t	e16c575f-7d3a-4d12-bec6-3cac9a232e70
7b18d77d-422b-460d-ab88-29ccac460865	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	8	60	t	e16c575f-7d3a-4d12-bec6-3cac9a232e70
d92f4ab6-d19a-41c1-8cdc-3df0c1a2d0f8	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	t	e16c575f-7d3a-4d12-bec6-3cac9a232e70
781384c8-b967-4db3-b94a-ab2d98f1a576	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	8	60	t	f1e889db-de48-4615-9cf0-95f939931a39
8a4aa59b-fc9e-44c1-9ca4-6b7a466d87fd	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	8	60	t	f1e889db-de48-4615-9cf0-95f939931a39
7cf96a2e-d022-4bb3-9ec2-9b3290a69ec8	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	8	60	t	f1e889db-de48-4615-9cf0-95f939931a39
f817dd83-10aa-4af9-a95c-754321d0bfba	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	4	8	60	t	f1e889db-de48-4615-9cf0-95f939931a39
49f9fe2d-3704-44d3-888e-602ea8b1967a	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	10	50	t	f1e889db-de48-4615-9cf0-95f939931a39
9d167bfa-12de-4a21-8bf5-d9ccc48bb617	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	10	50	t	f1e889db-de48-4615-9cf0-95f939931a39
be80323f-e6a1-4c6d-a952-d43921760b88	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	t	f1e889db-de48-4615-9cf0-95f939931a39
4a1a3e50-f233-4009-914c-53b53b9feb3e	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	1	10	50	t	29b50d61-9e52-4a23-a88c-1329e80b2cf2
d221b622-d839-4495-bbe8-68bffdbf7fdf	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	2	10	50	t	29b50d61-9e52-4a23-a88c-1329e80b2cf2
4b0872bd-69d4-4fab-86f7-9f67a9bb791f	4397a259-0e28-481f-89ab-5a4ab14f8714	Dominadas Pronas (Pull-ups)	3	10	50	f	29b50d61-9e52-4a23-a88c-1329e80b2cf2
\.


--
-- Data for Name: muscle_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.muscle_groups (id, name, "createdAt", "updatedAt") FROM stdin;
8b356bff-66eb-4cb5-a4a9-1f6680095c8c	Piernas	2026-10-15 21:37:53.336308	2026-10-15 21:37:53.336308
24feef6b-3498-47be-8b2c-20f4be307b80	Pecho	2026-10-15 21:37:53.4994	2026-10-15 21:37:53.4994
66ce3c0f-1781-4f45-a53a-950eba2a86ff	Espalda	2026-10-15 21:37:53.505809	2026-10-15 21:37:53.505809
871f5160-b3e5-42f5-84ec-4208aaecd6d9	Hombros	2026-10-15 21:37:53.517166	2026-10-15 21:37:53.517166
57afa91d-865f-412f-b587-63f323de3cda	Brazos	2026-10-15 21:37:53.528202	2026-10-15 21:37:53.528202
f0721053-7643-45b5-aaa2-57fefa776914	Core	2026-10-15 21:37:53.539432	2026-10-15 21:37:53.539432
c8cc7cf2-47b3-488e-bb62-483eb14ffbaa	Glúteos	2026-10-15 21:37:53.550207	2026-10-15 21:37:53.550207
8bd3df53-833f-4193-b7af-5426e6971ff1	Cardio / Full Body	2026-10-15 21:37:53.56119	2026-10-15 21:37:53.56119
\.


--
-- Data for Name: routine_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routine_templates (id, "trainerId", name, description, category, "exerciseItemsJson", "createdAt") FROM stdin;
50f40755-ba78-4aef-8dba-347be4c05a6e	SYSTEM	Rutina de Empuje (Push) - Pecho, Hombro y Tríceps	Enfocada en el desarrollo de la fuerza en empujes horizontales y verticales.	Fuerza e Hipertrofia	[{"id":"","exerciseId":"28d4f0c8-dd5c-4196-ad10-9d323abe85d7","exerciseName":"Press de Banca Plano","targetSets":4,"targetReps":8,"targetWeightKg":70,"restSeconds":120,"notes":"Retracción escapular activa","cadence":"3-0-1-0"}]	2026-10-14 00:08:47.758061
a3023bb5-ac39-44fd-8148-c67a983e9dc4	SYSTEM	Rutina de Tracción (Pull) - Espalda y Bíceps	Desarrollo de densidad y amplitud dorsal.	Fuerza e Hipertrofia	[{"id":"","exerciseId":"f9162763-b49a-4a3f-a171-015c823d7f19","exerciseName":"Peso Muerto Convencional","targetSets":3,"targetReps":5,"targetWeightKg":100,"restSeconds":180,"notes":"Bloqueo dorsal neutro","cadence":"2-1-1-0"},{"id":"","exerciseId":"4397a259-0e28-481f-89ab-5a4ab14f8714","exerciseName":"Dominadas Pronas (Pull-ups)","targetSets":4,"targetReps":10,"targetWeightKg":0,"restSeconds":90,"notes":"Rango completo de movimiento","cadence":"3-0-1-1"}]	2026-10-14 00:08:47.838422
9fff9c05-394b-4165-951d-7560ee2ebb4e	SYSTEM	Rutina de Piernas (Legs) - Cuádriceps e Isquios	Máxima activación del tren inferior y estabilidad de cadera.	Fuerza e Hipertrofia	[{"id":"","exerciseId":"531448b1-2a30-4147-b9f7-d97fb80d36d8","exerciseName":"Sentadilla Profunda","targetSets":4,"targetReps":8,"targetWeightKg":80,"restSeconds":150,"notes":"Profundidad por debajo del paralelo","cadence":"3-1-1-0"}]	2026-10-14 00:08:47.855325
\.


--
-- Data for Name: routines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routines (id, name, "dayOfWeek", description, "trainingPlanId") FROM stdin;
8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	1	Sesión focalizada en cargas principales de tren inferior y pectoral.	667a4c9f-2bdd-4d71-9af4-5af237985a92
9fc6841e-589e-4c31-ba69-6d45205b21af	Día 2: Tracción y Cadena Posterior	3	Trabajo de fuerza pura en bisagra de cadera y empuje vertical.	667a4c9f-2bdd-4d71-9af4-5af237985a92
8ea31c92-bbea-4e29-88f2-ee0a0b43031d	Día 1: Piernas y Core	1	Enfoque en sentadilla y potencia inferior	9d984fec-8ffe-4875-86d4-296edbbda3ab
35bd926a-07f0-491d-a417-c63f0ac162b4	Día 2: Torso y Empuje	3	Enfoque en press de banca y hombros	9d984fec-8ffe-4875-86d4-296edbbda3ab
12cbdc04-50a0-484b-999e-7de76cd62e3e	Día 1: Piernas y Core	1	Enfoque en sentadilla y potencia inferior	ad92b930-a102-4c1e-bfa7-9e22f5d9f9a4
1aa32830-766a-44c7-9f50-e33a7bbff5c7	Día 2: Torso y Empuje	3	Enfoque en press de banca y hombros	ad92b930-a102-4c1e-bfa7-9e22f5d9f9a4
411d152f-fc61-46e0-bd9d-0aa38ab47f83	Día 1: Piernas y Core	1	Enfoque en sentadilla y potencia inferior	f8ca4a3d-d7b4-412a-82c6-5e9e03d449fd
41add26a-4f6d-4dd2-923b-8a7ead0b0bd4	Día 2: Torso y Empuje	3	Enfoque en press de banca y hombros	f8ca4a3d-d7b4-412a-82c6-5e9e03d449fd
60e8c6f7-5f34-48d3-9b61-abe71a6ded5a	Día 1: Piernas y Core	1	Enfoque en sentadilla y potencia inferior	e49eb1fa-59ec-4d39-913b-80d55ac74ec0
ddf19dc2-b424-40f6-9c09-049c093513b6	Día 2: Torso y Empuje	3	Enfoque en press de banca y hombros	e49eb1fa-59ec-4d39-913b-80d55ac74ec0
9b807b1d-5720-46a5-bd23-2b30c0d6772b	Día 3: Sesión Personalizada	5		e49eb1fa-59ec-4d39-913b-80d55ac74ec0
687088ca-32d5-4b94-8143-2ea8005a1a3a	Día 1: Piernas y Core	1	Enfoque en sentadilla y potencia inferior	85154914-3661-490b-a686-751ddc7a792b
e80b21d0-558c-4e9d-b392-31d42c7fc360	Día 2: Torso y Empuje	3	Enfoque en press de banca y hombros	85154914-3661-490b-a686-751ddc7a792b
0e949eca-9d66-4375-b960-4b780daa544d	Día 1: Torso y Empuje	3	Enfoque en press de banca y hombros	31342778-f5cc-4a1f-8803-f87fe3abd213
06ddbac3-cc8e-4021-967c-c0172f514375	Día 1: Torso y Empuje (Push)	1	Enfoque en press de banca y hombros	2116cc6d-55c8-4afa-b60c-2b679c3568fd
42c44cd0-459d-4ad3-887a-8aa57a3800d2	Día 2: Espalda y Tracción (Pull)	3		2116cc6d-55c8-4afa-b60c-2b679c3568fd
4ae6544d-a1eb-4497-b09f-0014c0e567f5	Día 3: Piernas y Core	5		2116cc6d-55c8-4afa-b60c-2b679c3568fd
7fe8c3ae-1529-467d-a080-6cb7abf843c5	Día 1: Torso y Empuje (Push)	1	Enfoque en press de banca y hombros	06a02f89-96b3-4019-aa36-2b0807a9f20e
144873c6-e496-4474-abe0-568e10156248	Día 2: Espalda y Tracción (Pull)	3		06a02f89-96b3-4019-aa36-2b0807a9f20e
af872113-4dcd-412f-be3b-79f817057a77	Día 3: Piernas y Core	5		06a02f89-96b3-4019-aa36-2b0807a9f20e
3b9f6a00-6ce6-47cd-83ad-03b42d40346e	Día 1: Torso y Empuje (Push)	6	Enfoque en press de banca y hombros	eef56145-9b27-470c-947c-4f7e9c694306
57787b16-62c4-45cf-9882-c75d595a71cd	Día 2: Espalda y Tracción (Pull)	3		eef56145-9b27-470c-947c-4f7e9c694306
a80b0922-2a5d-44a6-a583-b7ccfd5377d0	Día 3: Piernas y Core	5		eef56145-9b27-470c-947c-4f7e9c694306
fdcf108b-87f7-415f-944f-65735529f5e3	Día 1: Torso y Empuje (Push)	1	Enfoque en press de banca y hombros	95a247bb-ede0-4ad6-9dd5-dc2b421e3c19
8d35a31e-486f-4343-ab7c-8d2cfcd05047	Día 2: Espalda y Tracción (Pull)	3		95a247bb-ede0-4ad6-9dd5-dc2b421e3c19
1f082a38-5a01-4dcb-bb06-633cbec21d59	Día 3: Piernas y Core	5		95a247bb-ede0-4ad6-9dd5-dc2b421e3c19
0d9e19b7-1160-452d-870e-96fd7228b11d	Día 1: Torso y Empuje (Push)	1	Enfoque en press de banca y hombros	0fbe73ba-9f6f-4822-972f-62554c074852
df1d8c5a-f63c-45d7-a6ea-e6d17fa0e78f	Día 2: Espalda y Tracción (Pull)	3		0fbe73ba-9f6f-4822-972f-62554c074852
d814cbc4-54cc-473a-bd04-9539182eae35	Día 3: Piernas y Core	5		0fbe73ba-9f6f-4822-972f-62554c074852
\.


--
-- Data for Name: target_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.target_zones (id, name, "muscleGroupName", "createdAt", "updatedAt") FROM stdin;
ebd0b9c2-afe3-419b-915b-09809f859703	Cuádriceps	Piernas	2026-10-15 21:37:53.579499	2026-10-15 21:37:53.579499
4f158e7f-75e7-455a-8ef5-f6d2c812a520	Glúteo Mayor	Piernas	2026-10-15 21:37:53.589462	2026-10-15 21:37:53.589462
2941dc61-4a32-40e6-b1ab-d2a7214f0d96	Glúteo Medio	Piernas	2026-10-15 21:37:53.595651	2026-10-15 21:37:53.595651
6f749d91-defe-4371-a699-e8eb516b12c6	Isquiotibiales	Piernas	2026-10-15 21:37:53.600817	2026-10-15 21:37:53.600817
80c023e9-ad9a-421c-a2c4-bb48ba2b87c4	Aductores	Piernas	2026-10-15 21:37:53.606049	2026-10-15 21:37:53.606049
167bdb16-42ed-45e1-a529-aaad88aec7f3	Gemelos	Piernas	2026-10-15 21:37:53.611164	2026-10-15 21:37:53.611164
4e6ba672-4544-4e51-bc8d-d127fc693cc4	Pectoral Mayor	Pecho	2026-10-15 21:37:53.62703	2026-10-15 21:37:53.62703
1e31b9ee-618a-4bd8-a34c-01a1f548cf18	Pectoral Superior	Pecho	2026-10-15 21:37:53.632389	2026-10-15 21:37:53.632389
ac6698b4-7705-43d9-87b5-b1c895952b04	Deltoides Anterior	Hombros	2026-10-15 21:37:53.638166	2026-10-15 21:37:53.638166
96c3860f-5153-4c70-898f-6463a123e53e	Deltoides Lateral	Hombros	2026-10-15 21:37:53.644203	2026-10-15 21:37:53.644203
ed18741d-4d7f-4b42-a7f4-717c5093250a	Deltoides Posterior	Hombros	2026-10-15 21:37:53.650184	2026-10-15 21:37:53.650184
f4a1d1a3-f1f2-458f-811c-0802a033df7b	Dorsal Ancho	Espalda	2026-10-15 21:37:53.660279	2026-10-15 21:37:53.660279
c2505cfb-ab99-4330-a6bb-0fbb523a0360	Trapecio	Espalda	2026-10-15 21:37:53.67153	2026-10-15 21:37:53.67153
d7c37f2b-e56f-4d62-96cf-44f4bc90d787	Erectores Espinales	Espalda	2026-10-15 21:37:53.682655	2026-10-15 21:37:53.682655
e90c1364-fa91-49dd-be5c-5992e9bd45d2	Bíceps Braquial	Brazos	2026-10-15 21:37:53.69343	2026-10-15 21:37:53.69343
942e1e1c-acad-4418-82fb-b7ac1272081a	Tríceps Braquial	Brazos	2026-10-15 21:37:53.704872	2026-10-15 21:37:53.704872
d6996e75-b464-411c-ab3b-88c2bd0eee93	Braquiorradial	Brazos	2026-10-15 21:37:53.715622	2026-10-15 21:37:53.715622
43705479-771d-4641-b1f8-1e5e3b604604	Abdomen	Core	2026-10-15 21:37:53.726745	2026-10-15 21:37:53.726745
19e7cfa7-8158-4492-86da-d0c41e3c66a4	Oblicuos	Core	2026-10-15 21:37:53.738053	2026-10-15 21:37:53.738053
a0cb12a2-39ee-4053-a066-9e0b83695ec1	Lumbares	Core	2026-10-15 21:37:53.749101	2026-10-15 21:37:53.749101
bf2173a8-6307-4188-97d2-6c10f35bc725	Pectoral Mayor (Porción Clavicular)	Pecho	2026-10-17 16:40:10.68855	2026-10-17 16:40:10.68855
5e288eb5-25d7-46a5-ae88-a9a76d3a379b	Pectoral Menor	Pecho	2026-10-17 16:55:07.555251	2026-10-17 16:55:07.555251
29fd534a-7bf0-4545-9d77-67110c2a2511	Pectoral Mayor (Porción Inferior)	Pecho	2026-10-17 17:40:16.776112	2026-10-17 17:40:16.776112
5c283786-ae0a-4aa1-8b55-d8ee84669af5	Trapecio (Inferior/Medio)	Espalda	2026-10-17 17:43:33.088647	2026-10-17 17:43:33.088647
7e4b21de-230a-4b70-8131-0bd88adf2eb2	Romboides	Espalda	2026-10-17 17:43:35.439872	2026-10-17 17:43:35.439872
f338b76c-9629-4825-ba53-e3837e1c1cc0	Redondo Mayor	Espalda	2026-10-17 18:43:02.217439	2026-10-17 18:43:02.217439
2540b1d0-c8e3-42ab-a899-40bdacc20eb8	Trapecio Medio	Espalda	2026-10-17 18:59:05.644016	2026-10-17 18:59:05.644016
8f8e72d9-de48-4c22-9a24-55f2f8e087b8	Core	Hombros	2026-10-17 19:10:20.927666	2026-10-17 19:10:20.927666
736b68ca-f694-43de-abd3-cc686ffd3eff	Manguito Rotador	Hombros	2026-10-17 19:19:32.704986	2026-10-17 19:19:32.704986
d4f31254-4b93-496b-a232-6f54b1b939c8	Braquial Anterior	Brazos	2026-10-17 19:39:59.300361	2026-10-17 19:39:59.300361
79970b03-17b0-4bf3-ab89-1604a87d7594	Tríceps Braquial (Cabeza Lateral)	Brazos	2026-10-17 19:44:45.868313	2026-10-17 19:44:45.868313
2825e9db-cc75-4cb8-8c3d-ba6b354fda85	Tríceps Braquial (Cabeza Media)	Brazos	2026-10-17 19:44:45.889307	2026-10-17 19:44:45.889307
f8e4600f-2887-4d11-a5e2-b3aa4f9ac6b1	Tríceps Braquial (Cabeza Larga)	Brazos	2026-10-17 19:51:49.22818	2026-10-17 19:51:49.22818
f9b8fe08-1660-465f-8a08-8d37f46289e3	Gastrocnemio	Piernas	2026-10-17 20:08:27.368579	2026-10-17 20:08:27.368579
b1e332ed-e048-41d7-b933-755d37cf54db	Sóleo	Piernas	2026-10-17 20:08:29.705729	2026-10-17 20:08:29.705729
397f0e37-4f50-4724-a941-92cfb1b9e152	Glúteo Menor	Glúteos	2026-10-17 20:13:43.008988	2026-10-17 20:13:43.008988
de4f374c-5598-47b8-afff-13be3b42a7c6	Transverso del Abdomen	Core	2026-10-17 20:15:37.55197	2026-10-17 20:15:37.55197
17ad71ea-2ade-4a04-a22f-89275108fb3b	Recto Abdominal	Core	2026-10-17 20:15:37.571354	2026-10-17 20:15:37.571354
e2e1a200-a076-4c54-97dc-4511f77735a2	Flexores de Cadera	Core	2026-10-17 20:17:43.267269	2026-10-17 20:17:43.267269
20b54f5a-ea94-4eac-8a1c-69309004b101	Deltoides	Cardio / Full Body	2026-10-17 20:42:46.890949	2026-10-17 20:42:46.890949
0ffc9e98-94ed-43c4-a61e-12c2d5588f4c	Tríceps	Hombros	2026-11-20 19:09:23.030851	2026-11-20 19:09:23.030851
\.


--
-- Data for Name: training_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.training_plans (id, name, "athleteId", "trainerId", "athleteName", "trainerName", "startDate", "endDate", "isActive", "createdAt", "updatedAt", "frequencyPerWeek", "sessionsPerDay") FROM stdin;
667a4c9f-2bdd-4d71-9af4-5af237985a92	Fuerza e Hipertrofia Fase 1 (4 Semanas)	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Prof. Carlos Mendoza	2026-10-13	2026-11-10	f	2026-10-13 20:18:54.990004	2026-10-13 20:56:27.693585	3	1
9d984fec-8ffe-4875-86d4-296edbbda3ab	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Prof. Carlos Mendoza	2026-10-13	2026-11-10	f	2026-10-13 20:56:28.071516	2026-10-13 21:14:35.318087	3	1
ad92b930-a102-4c1e-bfa7-9e22f5d9f9a4	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Prof. Carlos Mendoza	2026-10-14	2026-11-11	f	2026-10-13 21:14:35.332211	2026-10-14 19:39:57.070353	3	1
f8ca4a3d-d7b4-412a-82c6-5e9e03d449fd	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-14	2026-11-11	f	2026-10-14 19:39:57.668492	2026-10-14 20:39:10.389184	3	1
e49eb1fa-59ec-4d39-913b-80d55ac74ec0	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-14	2026-11-11	f	2026-10-14 20:39:10.402859	2026-10-15 22:27:39.981611	3	1
85154914-3661-490b-a686-751ddc7a792b	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-16	2026-11-13	f	2026-10-15 22:27:42.423685	2026-10-16 00:27:13.967039	3	1
31342778-f5cc-4a1f-8803-f87fe3abd213	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-16	2026-11-13	f	2026-10-16 00:27:14.152568	2026-10-17 21:19:14.845401	3	1
2116cc6d-55c8-4afa-b60c-2b679c3568fd	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-19	2026-11-15	f	2026-10-17 21:19:14.928923	2026-10-17 21:20:09.013181	3	1
06a02f89-96b3-4019-aa36-2b0807a9f20e	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-17	2026-11-15	f	2026-10-17 21:20:09.024324	2026-10-17 21:20:51.0654	3	1
eef56145-9b27-470c-947c-4f7e9c694306	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-17	2026-11-15	f	2026-10-17 21:20:51.077608	2026-10-17 21:21:31.607378	3	1
95a247bb-ede0-4ad6-9dd5-dc2b421e3c19	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-17	2026-11-15	f	2026-10-17 21:21:31.963553	2026-10-19 16:26:46.872539	3	1
0fbe73ba-9f6f-4822-972f-62554c074852	Mesociclo de Hipertrofia & Fuerza	c389507d-0b39-4efc-8fc3-dff49166acdf	aa706a31-1c4e-41b4-8fa0-ec007de8eed9	Lucas Gómez	Carlos Mendoza (Head Coach)	2026-10-17	2026-11-15	t	2026-10-19 16:26:49.039	2026-10-19 16:26:49.039	3	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, "passwordHash", "fullName", role, phone, notes, "createdAt", "updatedAt", "trainerId", "avatarUrl") FROM stdin;
aa706a31-1c4e-41b4-8fa0-ec007de8eed9	entrenador@gym.com	$2b$10$pygayJkrPyr19lV/U7DOueAn5AE6Lk/ot2X3vmGHEXzW8vbti8wDa	Carlos Mendoza (Head Coach)	ENTRENADOR	+54 11 9999-9999	Especialista en Fuerza e Hipertrofia	2026-10-13 20:18:54.67125	2026-10-14 00:27:09.974644	\N	\N
c389507d-0b39-4efc-8fc3-dff49166acdf	atleta@gym.com	$2b$10$pygayJkrPyr19lV/U7DOuernIy5PieUvu.SAbgvw/s9p./eJxagRe	Lucas Gómez	ATLETA	+54 9 11 9988-7766	Objetivo: Ganancia de masa muscular y fuerza en sentadillas	2026-10-13 20:18:54.822758	2026-10-16 01:03:13.95428	\N	data:image/jpeg;base64,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
bb93a5b6-1aaf-4539-8252-15e12a72b458	admin@gym.com	$2b$10$0So7T1spMBquo0LULTevuulHqI1f52dyXrry9E74M.NfXyWrQmLDy	Administrador del Sistema	ADMIN	+54 9 11 0000-1111	Gestión global de la plataforma	2026-10-14 00:06:52.702389	2026-10-17 21:24:05.610993	\N	data:image/jpeg;base64,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
\.


--
-- Data for Name: workout_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workout_sessions (id, "athleteId", "trainingPlanId", "routineId", "routineName", date, completed, notes, "createdAt", rpe) FROM stdin;
506a1d38-4fde-4e5c-ad2d-739ed2bd89bf	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-09-22	t	Sesión completada con buena técnica	2026-10-13 20:18:55.082068	\N
ec879803-034b-4925-b2a7-acd7308d1996	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-09-29	t	Sesión completada con buena técnica	2026-10-13 20:18:55.113514	\N
d33af983-2c78-4230-96bc-6400a0f19211	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-06	t	Sesión completada con buena técnica	2026-10-13 20:18:55.137005	\N
179e0f90-e8fb-41c1-9db7-b8a274453851	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-13	t		2026-10-13 20:50:23.778628	\N
5ec718fc-d0b0-46c2-a8bc-981a68cae6d0	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-13	t		2026-10-13 20:50:29.339169	\N
75fc0003-de1b-418f-8e35-19be7903c5eb	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-13	t		2026-10-13 20:50:30.411721	\N
9db9d31e-c1df-4cf9-84a5-631419b405b1	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-13	t		2026-10-13 20:50:31.522886	\N
ecfe460b-28a3-4ce5-ae59-e6065dbdfb84	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-13	t		2026-10-13 20:50:32.103413	\N
f5102b02-b23e-4637-be8a-3a4966f03a00	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	8f6b6618-e4b0-4449-804f-f84d6a52cc8c	Día 1: Fuerza Inferior y Tren Superior	2026-10-13	t	hahahaa	2026-10-13 20:50:40.70019	\N
b4d58177-97f0-47b7-ac3f-caf6762f2892	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	9fc6841e-589e-4c31-ba69-6d45205b21af	Día 2: Tracción y Cadena Posterior	2026-10-13	t		2026-10-13 20:51:34.735285	\N
9a6269e9-a18b-4e47-86d2-1f39bac67d57	c389507d-0b39-4efc-8fc3-dff49166acdf	667a4c9f-2bdd-4d71-9af4-5af237985a92	9fc6841e-589e-4c31-ba69-6d45205b21af	Día 2: Tracción y Cadena Posterior	2026-10-13	t		2026-10-13 20:51:38.758131	\N
434d1bf4-c421-4cc5-974c-0f7d34968ec3	c389507d-0b39-4efc-8fc3-dff49166acdf	9d984fec-8ffe-4875-86d4-296edbbda3ab	8ea31c92-bbea-4e29-88f2-ee0a0b43031d	Día 1: Piernas y Core	2026-10-14	t	Mejorando Los pesos	2026-10-13 21:12:58.224119	\N
8c9a2b0e-6f86-485c-bef3-ec41b3b0abd3	c389507d-0b39-4efc-8fc3-dff49166acdf	ad92b930-a102-4c1e-bfa7-9e22f5d9f9a4	1aa32830-766a-44c7-9f50-e33a7bbff5c7	Día 2: Torso y Empuje	2026-10-14	t		2026-10-14 00:38:13.424687	\N
13a92424-36fb-47e0-b3f5-1104a74b0ba4	c389507d-0b39-4efc-8fc3-dff49166acdf	ad92b930-a102-4c1e-bfa7-9e22f5d9f9a4	12cbdc04-50a0-484b-999e-7de76cd62e3e	Día 1: Piernas y Core	2026-10-14	t		2026-10-14 00:38:22.344546	\N
4d1d2135-c67f-4a3f-85ee-382201ae15d0	c389507d-0b39-4efc-8fc3-dff49166acdf	f8ca4a3d-d7b4-412a-82c6-5e9e03d449fd	411d152f-fc61-46e0-bd9d-0aa38ab47f83	Día 1: Piernas y Core	2026-10-14	t		2026-10-14 20:19:37.649058	\N
b39f2c32-4f89-43f7-a324-d9398021a20f	c389507d-0b39-4efc-8fc3-dff49166acdf	f8ca4a3d-d7b4-412a-82c6-5e9e03d449fd	41add26a-4f6d-4dd2-923b-8a7ead0b0bd4	Día 2: Torso y Empuje	2026-10-14	t		2026-10-14 20:38:40.513873	\N
2bd01f9c-8d67-4661-93a0-f454f202a62d	c389507d-0b39-4efc-8fc3-dff49166acdf	e49eb1fa-59ec-4d39-913b-80d55ac74ec0	9b807b1d-5720-46a5-bd23-2b30c0d6772b	Día 3: Sesión Personalizada	2026-10-14	t		2026-10-14 20:39:32.197915	\N
ede6d879-b5ce-40f5-b666-3aada1cd3e93	c389507d-0b39-4efc-8fc3-dff49166acdf	e49eb1fa-59ec-4d39-913b-80d55ac74ec0	ddf19dc2-b424-40f6-9c09-049c093513b6	Día 2: Torso y Empuje	2026-10-14	t		2026-10-14 20:53:27.372477	\N
cdc1605c-423a-42f7-a527-ed615b98940f	c389507d-0b39-4efc-8fc3-dff49166acdf	e49eb1fa-59ec-4d39-913b-80d55ac74ec0	60e8c6f7-5f34-48d3-9b61-abe71a6ded5a	Día 1: Piernas y Core	2026-10-14	t		2026-10-14 20:53:46.061672	\N
d077fd9b-b653-4665-875b-9a546daecaf8	c389507d-0b39-4efc-8fc3-dff49166acdf	e49eb1fa-59ec-4d39-913b-80d55ac74ec0	9b807b1d-5720-46a5-bd23-2b30c0d6772b	Día 3: Sesión Personalizada	2026-10-15	t		2026-10-14 21:02:55.042753	\N
e16c575f-7d3a-4d12-bec6-3cac9a232e70	c389507d-0b39-4efc-8fc3-dff49166acdf	e49eb1fa-59ec-4d39-913b-80d55ac74ec0	ddf19dc2-b424-40f6-9c09-049c093513b6	Día 2: Torso y Empuje	2026-10-15	t		2026-10-14 21:04:11.939667	\N
f1e889db-de48-4615-9cf0-95f939931a39	c389507d-0b39-4efc-8fc3-dff49166acdf	85154914-3661-490b-a686-751ddc7a792b	e80b21d0-558c-4e9d-b392-31d42c7fc360	Día 2: Torso y Empuje	2026-10-16	t		2026-10-15 22:29:56.843082	\N
29b50d61-9e52-4a23-a88c-1329e80b2cf2	c389507d-0b39-4efc-8fc3-dff49166acdf	31342778-f5cc-4a1f-8803-f87fe3abd213	0e949eca-9d66-4375-b960-4b780daa544d	Día 1: Torso y Empuje	2026-10-16	t		2026-10-16 00:27:44.014319	\N
\.


--
-- Name: training_plans PK_246975cb895b51662b90515a390; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_plans
    ADD CONSTRAINT "PK_246975cb895b51662b90515a390" PRIMARY KEY (id);


--
-- Name: routines PK_6847e8f0f74e65a6f10409dee9f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routines
    ADD CONSTRAINT "PK_6847e8f0f74e65a6f10409dee9f" PRIMARY KEY (id);


--
-- Name: routine_templates PK_6dd604fbdbc8f323d75ebd1ebc9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routine_templates
    ADD CONSTRAINT "PK_6dd604fbdbc8f323d75ebd1ebc9" PRIMARY KEY (id);


--
-- Name: muscle_groups PK_87e03ee9f78be5d7a7d0e08897e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muscle_groups
    ADD CONSTRAINT "PK_87e03ee9f78be5d7a7d0e08897e" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: exercises PK_c4c46f5fa89a58ba7c2d894e3c3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY (id);


--
-- Name: body_weight_records PK_ccd5631be9337836859033a6a4a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.body_weight_records
    ADD CONSTRAINT "PK_ccd5631be9337836859033a6a4a" PRIMARY KEY (id);


--
-- Name: target_zones PK_e325a53ab6227dab2c658791221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.target_zones
    ADD CONSTRAINT "PK_e325a53ab6227dab2c658791221" PRIMARY KEY (id);


--
-- Name: workout_sessions PK_eea00e05dc78d40b55a588c9f57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT "PK_eea00e05dc78d40b55a588c9f57" PRIMARY KEY (id);


--
-- Name: logged_sets PK_f8641a8945e0f473f485310e66b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logged_sets
    ADD CONSTRAINT "PK_f8641a8945e0f473f485310e66b" PRIMARY KEY (id);


--
-- Name: exercise_items PK_ffbf4abe0dd6df9d53b33564bd3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_items
    ADD CONSTRAINT "PK_ffbf4abe0dd6df9d53b33564bd3" PRIMARY KEY (id);


--
-- Name: target_zones UQ_36eee1396edbc70a0e43d56e82e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.target_zones
    ADD CONSTRAINT "UQ_36eee1396edbc70a0e43d56e82e" UNIQUE (name);


--
-- Name: muscle_groups UQ_7b67dd7f791008ed1532e76a9c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muscle_groups
    ADD CONSTRAINT "UQ_7b67dd7f791008ed1532e76a9c4" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: routines FK_2232c7b89137c0994080362aed7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routines
    ADD CONSTRAINT "FK_2232c7b89137c0994080362aed7" FOREIGN KEY ("trainingPlanId") REFERENCES public.training_plans(id) ON DELETE CASCADE;


--
-- Name: logged_sets FK_7bcb31b3fac6784840e21b4d278; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logged_sets
    ADD CONSTRAINT "FK_7bcb31b3fac6784840e21b4d278" FOREIGN KEY ("sessionId") REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: exercise_items FK_f8dac810da6d09dbb452f218346; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_items
    ADD CONSTRAINT "FK_f8dac810da6d09dbb452f218346" FOREIGN KEY ("routineId") REFERENCES public.routines(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

