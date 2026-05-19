# Universal Hexagonal Architecture Rules

เอกสารนี้เป็นกฎกลางสำหรับทำโค้ดแบบ Hexagonal / Clean Architecture ในระดับ feature
ใช้ได้กับหลายโปรเจกต์โดยไม่ผูกกับชื่อโปรเจกต์เดิม

ถ้าจะส่งให้ AI ตัวอื่น ให้บอกมันก่อนว่า:

```txt
ให้อ่านกฎนี้ก่อนแก้โค้ดทุกครั้ง
ก่อนเขียนโค้ด ให้ค้น feature ที่มี pattern ใกล้เคียงในโปรเจกต์นี้ก่อน
ให้ทำตาม architecture และ naming convention ที่มีอยู่จริงในโปรเจกต์
ห้ามสร้าง style architecture ใหม่เองถ้าโปรเจกต์มี pattern อยู่แล้ว
ถ้า path หรือ framework ไม่ตรงกับตัวอย่าง ให้ map ตาม Project Variables ด้านล่าง
```

เป้าหมายของกฎนี้:

- อ่านไฟล์แล้วรู้ทันทีว่าอยู่ layer ไหน
- รู้ว่าไฟล์ทำหน้าที่อะไร
- รู้ว่า dependency ไหลทางไหน
- ไม่เอา UI, API, database, framework, และ business rule ไปปนกัน
- ย้ายกฎไปใช้โปรเจกต์อื่นได้โดยเปลี่ยนแค่ path และชื่อ feature

---

## 0. Project Variables

ก่อนใช้กฎนี้กับโปรเจกต์ใหม่ ให้กำหนดค่ากลางเหล่านี้ก่อน:

```txt
<FEATURE_ROOT> = root ที่เก็บ feature
ตัวอย่าง: app/Features, src/features, modules

<FEATURE_NAME> = ชื่อ feature
ตัวอย่าง: Insight, Log, Profile, Order

<API_ROOT> = root ของ API route / handler / controller
ตัวอย่าง: app/api, src/app/api, src/server/routes

<SHARED_UTILS_ROOT> = root ของ helper กลาง
ตัวอย่าง: src/shared/utils, core/utils, cors/utils

<API_CLIENT> = client กลางสำหรับเรียก API
ตัวอย่าง: apiClient, httpClient, fetchClient
```

ถ้าโปรเจกต์มี convention อยู่แล้ว ให้ใช้ convention เดิมก่อน แล้วใช้กฎนี้เป็นกรอบการแยก layer

---

## 1. Layer หลักในหนึ่ง Feature

หนึ่ง feature แบ่งหลัก ๆ เป็น 3 layer:

```txt
presentation
domain
data
```

และมี composition root สำหรับประกอบ dependency:

```txt
dependencyInjection.ts
```

โครงสร้างกลาง:

```txt
<FEATURE_ROOT>/<FeatureName>
├── presentation
│   ├── <FeatureName>View.tsx
│   ├── hooks/use<FeatureName>.ts
│   └── components/<ComponentName>.tsx
│
├── domain
│   ├── entities/<EntityName>Entity.ts
│   ├── repositories/I<FeatureName>Repository.ts
│   └── useCases/create<FeatureName>UseCases.ts
│
├── data
│   ├── dataSources/<FeatureName>ApiDataSource.ts
│   ├── models/<Name>ResponseModel.ts
│   ├── models/<Name>RequestModel.ts
│   ├── mappers/<Name>Mapper.ts
│   └── repositories/<FeatureName>RepositoryImp.ts
│
└── dependencyInjection.ts
```

ถ้าโปรเจกต์ไม่ได้ใช้ React ให้เปลี่ยน `presentation` เป็น view/controller layer ของ framework นั้น
แต่กฎเรื่อง dependency direction ยังเหมือนเดิม

---

## 2. Direction ของ Dependency

กฎหลัก:

```txt
presentation -> domain
data -> domain
domain -> ไม่รู้จัก presentation หรือ data
composition root -> domain + data
```

แปลว่า:

- `presentation` เรียก `useCase`
- `presentation` ห้ามเรียก `DataSource`, `RepositoryImp`, `<API_CLIENT>` ตรง ๆ
- `data` implement interface ของ `domain`
- `data` แปลง `ResponseModel` เป็น `Entity`
- `domain` ห้าม import `data`
- `domain` ห้าม import `presentation`
- `domain` ห้ามผูกกับ React, Next.js, database, HTTP client, ORM, หรือ browser API

ตัวอย่างที่ผิด:

```ts
// domain/useCases/create<FeatureName>UseCases.ts
// ผิด เพราะ domain รู้จัก data layer
import { FeatureApiDataSource } from "../../data/dataSources/FeatureApiDataSource";
```

ตัวอย่างที่ถูก:

```ts
// domain/useCases/create<FeatureName>UseCases.ts
import type { IFeatureRepository } from "../repositories/IFeatureRepository";
```

---

## 3. Presentation Layer

หน้าที่:

- แสดง UI หรือรับ request จาก user-facing layer
- รับ event จาก user
- เก็บ state สำหรับหน้าจอหรือ request flow
- เรียก use case
- แปลง entity เป็น view state ได้ถ้าจำเป็น
- ห้ามเรียก API, data source, repository implementation, database, หรือ ORM ตรง ๆ

ตัวอย่างไฟล์:

```txt
<FEATURE_ROOT>/<FeatureName>/presentation/<FeatureName>View.tsx
<FEATURE_ROOT>/<FeatureName>/presentation/hooks/use<FeatureName>.ts
<FEATURE_ROOT>/<FeatureName>/presentation/components/<ComponentName>.tsx
```

ตัวอย่างที่ถูก:

```ts
const result = await featureUseCases.getItems({
  page,
  limit,
  keyword,
});
```

ตัวอย่างที่ผิด:

```ts
await FeatureApiDataSource.getItems(...);
await FeatureRepositoryImp.getItems(...);
await apiClient.get(...);
```

---

## 4. Domain Layer

หน้าที่:

- เก็บ business entity
- เก็บ repository interface
- เก็บ use case
- เก็บ business rule ที่เป็นแกนของ feature
- เป็น layer ที่ไม่ผูกกับ API, UI, database, framework, หรือ transport

ตัวอย่างไฟล์:

```txt
<FEATURE_ROOT>/<FeatureName>/domain/entities/<EntityName>Entity.ts
<FEATURE_ROOT>/<FeatureName>/domain/repositories/I<FeatureName>Repository.ts
<FEATURE_ROOT>/<FeatureName>/domain/useCases/create<FeatureName>UseCases.ts
```

ห้ามใส่ใน domain:

- API response model
- request model ของ API
- React component
- hook ที่ผูกกับ React state
- ORM model
- database query
- HTTP client
- framework request/response object

---

## 5. Entity

Entity คือข้อมูลที่ domain ใช้จริง หลังจากแปลงจาก API, database, หรือ external source แล้ว

Rule:

```txt
ไฟล์ที่อยู่ใน domain/entities ต้องลงท้ายด้วย Entity
```

ตัวอย่าง:

```ts
export interface ItemEntity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemPageEntity {
  items: ItemEntity[];
  total: number;
  page: number;
}
```

ตัวอย่างที่ไม่ควรอยู่ใน `entities`:

```ts
export type GetItemsData = {};
export type UpdateItemInput = {};
export interface ItemResponseModel {}
```

เหตุผล:

- input / payload ไม่ใช่ entity
- API response model เป็นของ data layer
- entity ต้องเป็นรูปข้อมูลที่ domain ใช้จริง

---

## 6. Repository Interface

Repository interface เป็น contract ของ domain

Rule:

```txt
interface repository ใน domain ให้ขึ้นต้นด้วย I
```

ตัวอย่าง:

```ts
export interface IFeatureRepository {
  getItems: (data: {
    page: number;
    limit: number;
    keyword?: string;
  }) => Promise<ItemPageEntity>;

  updateItem: (
    id: string,
    data: {
      name: string;
    },
  ) => Promise<void>;

  deleteItem: (id: string) => Promise<void>;
}
```

ชื่อที่ใช้:

```txt
I<FeatureName>Repository
```

ชื่อที่ไม่ใช้ ถ้าโปรเจกต์นี้เลือก convention แบบนี้แล้ว:

```txt
<FeatureName>RepositoryPort
<FeatureName>RepositoryInterface
<FeatureName>Repository
```

---

## 7. Pure Data เข้า Repository

ข้อมูลที่ส่งเข้า repository ให้เป็น pure data object

ค่าเริ่มต้นของ ruleset นี้:

```txt
input เข้า repository = inline object
output ออกจาก repository = Entity
```

ตัวอย่างที่ถูก:

```ts
getItems: (data: {
  page: number;
  limit: number;
  keyword?: string;
}) => Promise<ItemPageEntity>;
```

ตัวอย่างที่ไม่เอา:

```ts
getItems: (data: GetItemsData) => Promise<ItemPageEntity>;
```

เหตุผล:

- เปิด repository interface แล้วเห็นทันทีว่าต้องส่งอะไร
- payload เล็กไม่ต้องสร้างชื่อ type เพิ่ม
- แยกชัดว่า input เป็น pure data ส่วน output เป็น entity

หมายเหตุ:

- ถ้า payload ใหญ่มากหรือใช้ซ้ำหลาย use case ให้สร้าง input type ใน domain ได้
- ห้ามใช้ `ResponseModel` หรือ API request model เป็น input/output ของ domain repository

---

## 8. UseCase

UseCase คือ action หรือ flow ของ feature

หน้าที่:

- รับ pure data จาก presentation
- validate หรือทำ business rule
- เรียก repository ผ่าน interface
- return entity กลับไป presentation

ตัวอย่าง:

```ts
export const createFeatureUseCases = (repository: IFeatureRepository) => ({
  getItems: async (data: {
    page: number;
    limit: number;
    keyword?: string;
  }): Promise<ItemPageEntity> => {
    return await repository.getItems(data);
  },

  updateItem: async (
    id: string,
    data: {
      name: string;
    },
  ): Promise<void> => {
    if (!data.name.trim()) {
      throw new Error("Name is required");
    }

    return await repository.updateItem(id, data);
  },
});
```

Business rule ที่ไม่ผูก UI/API ควรอยู่ใน use case หรือ domain helper

---

## 9. Data Layer

หน้าที่:

- เรียก API, database, storage, หรือ external service จริง
- เก็บ request/response model
- แปลง response model เป็น entity
- implement interface จาก domain

ตัวอย่างไฟล์:

```txt
<FEATURE_ROOT>/<FeatureName>/data/dataSources/<FeatureName>ApiDataSource.ts
<FEATURE_ROOT>/<FeatureName>/data/models/<Name>ResponseModel.ts
<FEATURE_ROOT>/<FeatureName>/data/models/<Name>RequestModel.ts
<FEATURE_ROOT>/<FeatureName>/data/mappers/<Name>Mapper.ts
<FEATURE_ROOT>/<FeatureName>/data/repositories/<FeatureName>RepositoryImp.ts
```

Data layer รู้จัก domain ได้:

```txt
data -> domain
```

แต่ domain ห้ามรู้จัก data

---

## 10. ResponseModel

ResponseModel คือข้อมูลดิบที่ได้จาก API, database, หรือ external source

ตัวอย่าง:

```ts
export interface ItemsResponseModel {
  data: ItemResponseModel[];
  total: number;
  page: number;
}
```

ResponseModel ควรอยู่ใน:

```txt
data/models
```

ไม่ควรอยู่ใน:

```txt
domain/entities
```

---

## 11. RequestModel

RequestModel คือข้อมูลที่ data source ใช้ส่งออกไปยัง API หรือ external source

ตัวอย่าง:

```ts
export interface UpdateItemRequestModel {
  name: string;
}
```

หมายเหตุ:

- RequestModel อยู่ data layer ได้
- อย่าเอา RequestModel ไปเป็น Entity
- อย่าให้ domain repository return หรือรับ RequestModel โดยตรง

---

## 12. DataSource

DataSource คือจุดที่คุยกับโลกภายนอกจริง

DataSource รู้จักสิ่งเหล่านี้ได้:

- `<API_CLIENT>`
- endpoint
- query params
- request model
- response model
- framework adapter ที่จำเป็นสำหรับ data access

ตัวอย่าง:

```ts
export const FeatureApiDataSource = {
  getItems: async ({
    page = 1,
    limit = 10,
    keyword,
  }: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<ItemsResponseModel> => {
    return await apiClient.get<ItemsResponseModel>("/items/get-items", {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...(keyword ? { keyword } : {}),
      },
    });
  },
};
```

DataSource return:

```txt
ResponseModel
```

ไม่ใช่:

```txt
Entity
```

---

## 13. Mapper (Layer Data)

Mapper คือจุดแปลงข้อมูลจาก data layer เป็น domain entity

Flow:

```txt
ResponseModel -> Mapper -> Entity
```

ตัวอย่าง:

```ts
export const ItemMapper = {
  toEntity: (dto: ItemResponseModel): ItemEntity => {
    return {
      id: dto.id,
      name: dto.name ?? "",
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  },

  toPageEntity: (dto: ItemsResponseModel): ItemPageEntity => {
    return {
      items: dto.data.map(ItemMapper.toEntity),
      total: dto.total,
      page: dto.page,
    };
  },
};
```

ถ้ามี format แปลกจาก API ให้แก้ใน mapper ไม่ใช่กระจายใน presentation

---

## 14. Repository Implementation

Rule:

```txt
ไฟล์ใน data/repositories ต้องลงท้ายด้วย Imp
```

Repository implementation คือ implementation ฝั่ง data ที่ทำตาม interface ของ domain

ตัวอย่าง:

```ts
export const FeatureRepositoryImp: IFeatureRepository = {
  getItems: async (data: {
    page: number;
    limit: number;
    keyword?: string;
  }): Promise<ItemPageEntity> => {
    const response = await FeatureApiDataSource.getItems(data);
    return ItemMapper.toPageEntity(response);
  },
};
```

หน้าที่:

- เรียก `DataSource`
- ได้ `ResponseModel`
- ใช้ `Mapper`
- return `Entity`
- ไม่เอา response ดิบหลุดกลับไป presentation

---

## 15. Dependency Injection

ไฟล์นี้เป็น composition root ของ feature

หน้าที่:

- เอา repository implementation จริงไปเสียบให้ use case
- เป็นจุดที่รู้จักทั้ง data และ domain ได้
- ซ่อนรายละเอียด data layer จาก presentation

ตัวอย่าง:

```ts
export const featureUseCases = createFeatureUseCases(FeatureRepositoryImp);
```

หมายเหตุ:

- ไฟล์นี้รู้จักทั้ง `data` และ `domain` ได้
- ถ้าโปรเจกต์ใช้ DI container ให้ไฟล์นี้ทำหน้าที่ register dependency
- ถ้า feature มีหลาย repository ให้ประกอบ dependency ที่นี่

---

## 16. Flow ที่ถูก

Flow กลาง:

```txt
presentation/<FeatureName>View.tsx
-> presentation/hooks/use<FeatureName>.ts
-> dependencyInjection.ts
-> domain/useCases/create<FeatureName>UseCases.ts
-> domain/repositories/I<FeatureName>Repository.ts
-> data/repositories/<FeatureName>RepositoryImp.ts
-> data/dataSources/<FeatureName>ApiDataSource.ts
-> data/models/<Name>ResponseModel.ts
-> data/mappers/<Name>Mapper.ts
-> domain/entities/<Name>Entity.ts
-> กลับไป presentation
```

เวอร์ชันสั้น:

```txt
UI / controller
-> use case
-> repository interface
-> repository implementation
-> data source
-> mapper
-> entity
-> UI / controller
```

---

## 17. API Route / Handler Rules

ค่าเริ่มต้นของ ruleset นี้:

```txt
1 route = 1 action
```

แปลว่า route หรือ handler หนึ่งไฟล์ควรทำงานเดียว และชื่อควรบอก action ชัดเจน

ตัวอย่าง action route:

```txt
<API_ROOT>/<resource>/get-<resources>/route.ts
<API_ROOT>/<resource>/create-<resource>/route.ts
<API_ROOT>/<resource>/update-<resource>/[id]/route.ts
<API_ROOT>/<resource>/delete-<resource>/[id]/route.ts
```

ตัวอย่าง:

```txt
app/api/items/get-items/route.ts
app/api/items/create-item/route.ts
app/api/items/update-item/[id]/route.ts
app/api/items/delete-item/[id]/route.ts
```

ตัวอย่างที่ไม่เอาใน convention นี้:

```ts
// app/api/items/route.ts
export async function GET() {}
export async function POST() {}
```

```ts
// app/api/items/[id]/route.ts
export async function GET() {}
export async function PUT() {}
export async function DELETE() {}
```

เหตุผล:

- action ชัดจากชื่อ path
- route หนึ่งไฟล์รับผิดชอบงานเดียว
- DataSource เรียก endpoint ที่ตรง action ได้ชัดเจน

ถ้าโปรเจกต์ใช้ REST convention แบบ resource route อยู่แล้ว:

- อย่าเปลี่ยนทั้งโปรเจกต์โดยไม่จำเป็น
- ให้รักษาหลัก single responsibility ใน handler/service
- อย่าใส่ business rule หนัก ๆ ใน route โดยตรง
- route/controller ควรส่งงานต่อไป use case หรือ service ที่ตรง architecture ของโปรเจกต์

---

## 18. Shared Helper Rules

ถ้า logic ใดเป็นของกลางและมี helper อยู่แล้ว ให้ใช้ helper กลาง

ตัวอย่าง:

- date/time format
- currency format
- validation format
- auth/session helper
- API error helper
- string/number normalizer

Rule:

```txt
อย่าเขียน logic ซ้ำกระจายในหลาย feature ถ้ามี helper กลางรองรับอยู่แล้ว
```

ตัวอย่างที่ควรใช้:

```txt
<SHARED_UTILS_ROOT>/date.ts
<SHARED_UTILS_ROOT>/format.ts
<SHARED_UTILS_ROOT>/validation.ts
```

ตัวอย่างที่ไม่เอา:

```ts
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateString = new Date(
  selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
)
  .toISOString()
  .split("T")[0];
```

เหตุผล:

- logic กระจายแล้วแก้ยาก
- timezone / locale / validation มักพังง่ายถ้าเขียนซ้ำ
- helper กลางทำให้ behavior ทั้งโปรเจกต์เหมือนกัน

---

## 19. Naming Rules

```txt
Feature folder:
<FEATURE_ROOT>/<FeatureName>

Presentation view:
presentation/<FeatureName>View.tsx

Presentation hook:
presentation/hooks/use<FeatureName>.ts

Domain entity file:
domain/entities/<Name>Entity.ts

Domain repository interface:
domain/repositories/I<FeatureName>Repository.ts

Domain use case:
domain/useCases/create<FeatureName>UseCases.ts

Data source:
data/dataSources/<FeatureName>ApiDataSource.ts

Data model:
data/models/<Name>ResponseModel.ts
data/models/<Name>RequestModel.ts

Data mapper:
data/mappers/<Name>Mapper.ts

Data repository implementation:
data/repositories/<FeatureName>RepositoryImp.ts

Dependency injection:
dependencyInjection.ts
```

ชื่อที่ไม่เอา ถ้าโปรเจกต์นี้เลือก convention ตาม ruleset นี้:

```txt
ports
RepositoryPort
RepositoryAdapter
RepositoryImpl
DependencyInjection.ts
domain/entity
domain/usecase
data/dataSource
```

เหตุผล:

- ใช้ `domain/repositories` แทน `domain/ports`
- interface ใช้ `I...Repository`
- implementation ใน data ใช้ `...RepositoryImp`
- folder ใช้พหูพจน์และ camel case เช่น `entities`, `useCases`, `dataSources`

---

## 20. Checklist ก่อนจบงาน

- `domain` ไม่ import `data`
- `domain` ไม่ import `presentation`
- `domain` ไม่ import framework, HTTP client, database, ORM
- `presentation` เรียก use case
- `presentation` ไม่เรียก data source ตรง
- `presentation` ไม่เรียก repository implementation ตรง
- interface repository ขึ้นต้นด้วย `I`
- entity ลงท้ายด้วย `Entity`
- ไฟล์ใน `domain/entities` มีแต่ entity
- repository รับ pure data
- repository return entity
- response model อยู่ใน `data/models`
- request model อยู่ใน `data/models`
- mapper อยู่ใน `data/mappers`
- repository implementation อยู่ใน `data/repositories` และชื่อไฟล์ลงท้ายด้วย `Imp`
- data source อยู่ใน `data/dataSources`
- dependencyInjection เป็นจุดประกอบ feature
- API route / handler ทำงานเดียวและชื่อบอก action ชัด
- DataSource ยิง endpoint หรือ external source ที่ตรง action
- ถ้ามี helper กลาง ให้ใช้ helper กลาง ไม่เขียน logic ซ้ำ
- รัน lint / typecheck / test / build ตามคำสั่งของโปรเจกต์

---

## 21. สรุปสั้นมาก

```txt
presentation
= UI, hook, component, controller-facing code
= เรียก use case

domain
= entity, interface, use case, business rule
= ไม่รู้จัก data/presentation/framework

data
= API, model, mapper, repository imp
= implement interface ของ domain

dependencyInjection
= ประกอบ repository imp เข้ากับ use case
```

```txt
ส่งเข้า repo = pure data
รับออกจาก repo = Entity
API / external response = ResponseModel
แปลงข้อมูล = Mapper
interface = ขึ้นต้น I
entities = ลงท้าย Entity
repository implementation = ลงท้าย Imp
API route / handler = ทำงานเดียว ชื่อ action ชัด
helper กลาง = ใช้ซ้ำ อย่าเขียนซ้ำ
```

---

## 22. วิธีใช้กับโปรเจกต์ใหม่

1. เปิดโปรเจกต์ใหม่แล้วหา feature ที่มี pattern ใกล้เคียงที่สุด
2. กำหนด `<FEATURE_ROOT>`, `<API_ROOT>`, `<SHARED_UTILS_ROOT>`, `<API_CLIENT>`
3. ถ้าโปรเจกต์มี convention เดิม ให้ map กฎนี้เข้ากับ convention เดิมก่อน
4. สร้าง feature ใหม่ด้วยโครง `presentation / domain / data / dependencyInjection`
5. เช็ก dependency direction ก่อนเขียน logic เพิ่ม
6. ใช้ checklist ก่อนจบงานทุกครั้ง

ถ้าต้องใช้ตัวอย่างจากโปรเจกต์เดิม:

- ใช้ตัวอย่างเป็น reference ได้
- เปลี่ยนชื่อ feature/entity/resource ให้ตรงโปรเจกต์ใหม่
- อย่ายึด endpoint, helper path, หรือชื่อ domain เดิมเป็นข้อบังคับ
- ให้ยึด dependency direction และหน้าที่ของแต่ละ layer เป็นหลัก
