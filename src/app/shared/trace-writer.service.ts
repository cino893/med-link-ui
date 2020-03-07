import { Injectable } from "@angular/core";
import {
  setCategories,
  enable,
  categories,
  messageType,
  clearWriters,
  addWriter,
  disable, addCategories
} from 'tns-core-modules/trace';
import { isUndefined } from "tns-core-modules/utils/types";
import { Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TraceWriterService {
  private customWriter = new TimestampConsoleWriter();

  constructor() {
    this.setupWriter();
  }

  public subscribe(
    next?: (value: ITraceMessage) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.customWriter.array.subscribe(next, error, complete);
  }

  private setupWriter() {
    // setCategories(categories.All);
    setCategories(categories.Error);
    enable();
    clearWriters();
    addWriter(this.customWriter);
  }

  public disableWriter() {
    disable();
  }
}

class TimestampConsoleWriter {
  public array = new Subject<ITraceMessage>();

  public write(message, category, type) {
    if (!console) {
      return;
    }
    let msgType = isUndefined(type) ? messageType.log : type;

    switch (msgType) {
      case messageType.log:
        this.array.next({
          messageType: "log",
          date: new Date().toISOString(),
          message: JSON.stringify(message),
          category: JSON.stringify(category)
        });
        break;
      case messageType.info:
        this.array.next({
          messageType: "info",
          date: new Date().toISOString(),
          message: JSON.stringify(message),
          category: JSON.stringify(category)
        });
        break;
      case messageType.warn:
        this.array.next({
          messageType: "warnings",
          date: new Date().toISOString(),
          message: JSON.stringify(message),
          category: JSON.stringify(category)
        });
        break;
      case messageType.error:
        this.array.next({
          messageType: "error",
          date: new Date().toISOString(),
          message: JSON.stringify(message),
          category: JSON.stringify(category)
        });
        break;
      default:
        break;
    }
  }
}

interface ITraceMessage {
  messageType: string;
  message: string;
  category: string;
  date: string;
}
