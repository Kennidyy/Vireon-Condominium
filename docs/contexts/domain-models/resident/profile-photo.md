# ProfilePhoto

## Classification

`ProfilePhoto` is an entity owned by the [`Resident`](resident.md) aggregate. It represents image metadata, not image bytes or a storage client.

## State

| Member         | Type              | Meaning                                            |
| -------------- | ----------------- | -------------------------------------------------- |
| `#id`          | [`Uuid`](uuid.md) | Profile-photo metadata identity                    |
| `#storageKey`  | `string`          | Opaque key expected to identify an external object |
| `#contentType` | `ImageType`       | `image/png` or `image/jpeg`                        |
| `#size`        | `number`          | Declared byte size                                 |

There is no `uploadedAt` field in the current entity or Prisma model.

## Creation

`ProfilePhoto.create(storageKey, contentType, size)` generates a UUID and enforces:

- Content type must be exactly `image/png` or `image/jpeg`.
- Size must not exceed 5 MiB (`5 * 1024 * 1024` bytes).
- Storage key must be truthy.

The current rules do not reject negative or fractional sizes, and they do not trim or otherwise validate the storage-key format.

## Default Metadata

`ProfilePhoto.default()` creates:

```json
{
  "storageKey": "defaults/profile.jpg",
  "contentType": "image/jpeg",
  "size": 124000
}
```

`CreateResidentUseCase` assigns this metadata to every newly created Resident. The implementation does not provision or verify an object at `defaults/profile.jpg`.

## Restoration

`ProfilePhoto.restore(id, storageKey, contentType, size)` validates the UUID and otherwise trusts persisted metadata. It does not repeat content-type, size, or storage-key validation.

## Replacement

All fields are read-only after construction. `Resident.changeProfilePhoto` replaces the entity reference with another ProfilePhoto. `UpdateProfilePhotoUseCase` creates and validates that replacement from JSON metadata, then persists it through a Prisma upsert.

When a photo row already exists, the mapper updates its storage key, type, and size but does not replace the row's persisted `id`. The newly generated domain ID is therefore used only when the upsert creates a missing row.

## Exceptions

| Exception                       | Code                      | Condition during creation                |
| ------------------------------- | ------------------------- | ---------------------------------------- |
| `StorageKeyIsRequiredException` | `STORAGE_KEY_IS_REQUIRED` | Storage key is empty or otherwise falsy. |
| `InvalidImageTypeException`     | `INVALID_IMAGE_TYPE`      | MIME type is not PNG or JPEG.            |
| `ImageExceedsMaxSizeException`  | `IMAGE_EXCEEDS_MAX_SIZE`  | Size exceeds 5 MiB.                      |
| `InvalidUuidException`          | `INVALID_UUID`            | A restored identifier is invalid.        |

## Domain and Persistence Mismatch

The Resident domain constructor requires ProfilePhoto, and the Prisma repository refuses to restore a Resident without one. Prisma declares the relationship optional, however, so the database schema permits a Resident row that the adapter treats as invalid and reports through a generic error.

## Storage Status

The HTTP endpoint accepts `storageKey`, `contentType`, and `size` as JSON. There is no multipart upload, object-storage adapter, object existence check, download or signed-URL operation, replacement cleanup, or deletion cleanup. The Resident API returns `storageKey` as the `profilePhoto` string.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/entities/ProfilePhoto.ts)
- [Tests](../../../../src/apps/api/src/modules/resident/domain/entities/ProfilePhoto.spec.ts)
- [Update use case](../../../../src/apps/api/src/modules/resident/application/use-cases/UpdateProfilePhotoUseCase.ts)
- [Persistence mapper](../../../../src/apps/api/src/modules/resident/infrastructure/mappers/ResidentMapper.ts)
- [Prisma model](../../../../src/apps/api/infrastructure/database/prisma/schema.prisma)

See the [Resident bounded context](../../bounded-contexts/resident.md).
