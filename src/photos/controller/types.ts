import { Done, NI_Next } from "fmagic";
import { AddPhotoData } from "../../types";
import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";

export type CheckFirestoreRecordOnAdd = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type CheckFirestoreRecordOnEditAndCollectWebIds = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type MakePhotoInfoAndPathsToOptimizedPhotos = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type MakeOptimizedPhotosAndBase64String = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type UploadPhotosToPhotosWebStorage = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type MakePhotoDataAndSendToDbOnAdd = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type MakePhotoDataAndSendToDbOnEdit = (
  data: AddPhotoData
) => Promise<NI_Next<AddPhotoData> | Done>;

export type SavePhotoToOriginalPhotoStorage = (
  logger: Logger
) => (data: AddPhotoData) => Promise<void>;

export type UpdatePhotoOnOriginalPhotoStorage = (
  logger: Logger
) => (data: AddPhotoData) => Promise<void>;

export type OnErrorResponse = (
  res: Response,
  logger: Logger,
  isEdit: boolean
) => (data: AddPhotoData) => void;

export type OnSuccessResponseOnAdd = (
  res: Response,
  logger: Logger
) => (data: AddPhotoData) => void;

export type OnSuccessResponseOnEdit = (
  res: Response,
  logger: Logger
) => (data: AddPhotoData) => void;
