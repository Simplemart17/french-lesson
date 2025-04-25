
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Lesson
 * 
 */
export type Lesson = $Result.DefaultSelection<Prisma.$LessonPayload>
/**
 * Model LessonProgress
 * 
 */
export type LessonProgress = $Result.DefaultSelection<Prisma.$LessonProgressPayload>
/**
 * Model Vocabulary
 * 
 */
export type Vocabulary = $Result.DefaultSelection<Prisma.$VocabularyPayload>
/**
 * Model UserVocabulary
 * 
 */
export type UserVocabulary = $Result.DefaultSelection<Prisma.$UserVocabularyPayload>
/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model ExamResult
 * 
 */
export type ExamResult = $Result.DefaultSelection<Prisma.$ExamResultPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lesson`: Exposes CRUD operations for the **Lesson** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lessons
    * const lessons = await prisma.lesson.findMany()
    * ```
    */
  get lesson(): Prisma.LessonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lessonProgress`: Exposes CRUD operations for the **LessonProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LessonProgresses
    * const lessonProgresses = await prisma.lessonProgress.findMany()
    * ```
    */
  get lessonProgress(): Prisma.LessonProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vocabulary`: Exposes CRUD operations for the **Vocabulary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vocabularies
    * const vocabularies = await prisma.vocabulary.findMany()
    * ```
    */
  get vocabulary(): Prisma.VocabularyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userVocabulary`: Exposes CRUD operations for the **UserVocabulary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserVocabularies
    * const userVocabularies = await prisma.userVocabulary.findMany()
    * ```
    */
  get userVocabulary(): Prisma.UserVocabularyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.examResult`: Exposes CRUD operations for the **ExamResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamResults
    * const examResults = await prisma.examResult.findMany()
    * ```
    */
  get examResult(): Prisma.ExamResultDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Lesson: 'Lesson',
    LessonProgress: 'LessonProgress',
    Vocabulary: 'Vocabulary',
    UserVocabulary: 'UserVocabulary',
    Conversation: 'Conversation',
    Message: 'Message',
    ExamResult: 'ExamResult'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "lesson" | "lessonProgress" | "vocabulary" | "userVocabulary" | "conversation" | "message" | "examResult"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Lesson: {
        payload: Prisma.$LessonPayload<ExtArgs>
        fields: Prisma.LessonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LessonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LessonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          findFirst: {
            args: Prisma.LessonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LessonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          findMany: {
            args: Prisma.LessonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          create: {
            args: Prisma.LessonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          createMany: {
            args: Prisma.LessonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LessonCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          delete: {
            args: Prisma.LessonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          update: {
            args: Prisma.LessonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          deleteMany: {
            args: Prisma.LessonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LessonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LessonUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          upsert: {
            args: Prisma.LessonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          aggregate: {
            args: Prisma.LessonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLesson>
          }
          groupBy: {
            args: Prisma.LessonGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonGroupByOutputType>[]
          }
          count: {
            args: Prisma.LessonCountArgs<ExtArgs>
            result: $Utils.Optional<LessonCountAggregateOutputType> | number
          }
        }
      }
      LessonProgress: {
        payload: Prisma.$LessonProgressPayload<ExtArgs>
        fields: Prisma.LessonProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LessonProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LessonProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          findFirst: {
            args: Prisma.LessonProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LessonProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          findMany: {
            args: Prisma.LessonProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>[]
          }
          create: {
            args: Prisma.LessonProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          createMany: {
            args: Prisma.LessonProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LessonProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>[]
          }
          delete: {
            args: Prisma.LessonProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          update: {
            args: Prisma.LessonProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          deleteMany: {
            args: Prisma.LessonProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LessonProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LessonProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>[]
          }
          upsert: {
            args: Prisma.LessonProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          aggregate: {
            args: Prisma.LessonProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLessonProgress>
          }
          groupBy: {
            args: Prisma.LessonProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.LessonProgressCountArgs<ExtArgs>
            result: $Utils.Optional<LessonProgressCountAggregateOutputType> | number
          }
        }
      }
      Vocabulary: {
        payload: Prisma.$VocabularyPayload<ExtArgs>
        fields: Prisma.VocabularyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VocabularyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VocabularyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>
          }
          findFirst: {
            args: Prisma.VocabularyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VocabularyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>
          }
          findMany: {
            args: Prisma.VocabularyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>[]
          }
          create: {
            args: Prisma.VocabularyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>
          }
          createMany: {
            args: Prisma.VocabularyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VocabularyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>[]
          }
          delete: {
            args: Prisma.VocabularyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>
          }
          update: {
            args: Prisma.VocabularyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>
          }
          deleteMany: {
            args: Prisma.VocabularyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VocabularyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VocabularyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>[]
          }
          upsert: {
            args: Prisma.VocabularyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VocabularyPayload>
          }
          aggregate: {
            args: Prisma.VocabularyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVocabulary>
          }
          groupBy: {
            args: Prisma.VocabularyGroupByArgs<ExtArgs>
            result: $Utils.Optional<VocabularyGroupByOutputType>[]
          }
          count: {
            args: Prisma.VocabularyCountArgs<ExtArgs>
            result: $Utils.Optional<VocabularyCountAggregateOutputType> | number
          }
        }
      }
      UserVocabulary: {
        payload: Prisma.$UserVocabularyPayload<ExtArgs>
        fields: Prisma.UserVocabularyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserVocabularyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserVocabularyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>
          }
          findFirst: {
            args: Prisma.UserVocabularyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserVocabularyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>
          }
          findMany: {
            args: Prisma.UserVocabularyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>[]
          }
          create: {
            args: Prisma.UserVocabularyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>
          }
          createMany: {
            args: Prisma.UserVocabularyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserVocabularyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>[]
          }
          delete: {
            args: Prisma.UserVocabularyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>
          }
          update: {
            args: Prisma.UserVocabularyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>
          }
          deleteMany: {
            args: Prisma.UserVocabularyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserVocabularyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserVocabularyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>[]
          }
          upsert: {
            args: Prisma.UserVocabularyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserVocabularyPayload>
          }
          aggregate: {
            args: Prisma.UserVocabularyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserVocabulary>
          }
          groupBy: {
            args: Prisma.UserVocabularyGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserVocabularyGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserVocabularyCountArgs<ExtArgs>
            result: $Utils.Optional<UserVocabularyCountAggregateOutputType> | number
          }
        }
      }
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      ExamResult: {
        payload: Prisma.$ExamResultPayload<ExtArgs>
        fields: Prisma.ExamResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>
          }
          findFirst: {
            args: Prisma.ExamResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>
          }
          findMany: {
            args: Prisma.ExamResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>[]
          }
          create: {
            args: Prisma.ExamResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>
          }
          createMany: {
            args: Prisma.ExamResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>[]
          }
          delete: {
            args: Prisma.ExamResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>
          }
          update: {
            args: Prisma.ExamResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>
          }
          deleteMany: {
            args: Prisma.ExamResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>[]
          }
          upsert: {
            args: Prisma.ExamResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamResultPayload>
          }
          aggregate: {
            args: Prisma.ExamResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamResult>
          }
          groupBy: {
            args: Prisma.ExamResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamResultCountArgs<ExtArgs>
            result: $Utils.Optional<ExamResultCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    lesson?: LessonOmit
    lessonProgress?: LessonProgressOmit
    vocabulary?: VocabularyOmit
    userVocabulary?: UserVocabularyOmit
    conversation?: ConversationOmit
    message?: MessageOmit
    examResult?: ExamResultOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    lessonProgress: number
    vocabulary: number
    examResults: number
    conversations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessonProgress?: boolean | UserCountOutputTypeCountLessonProgressArgs
    vocabulary?: boolean | UserCountOutputTypeCountVocabularyArgs
    examResults?: boolean | UserCountOutputTypeCountExamResultsArgs
    conversations?: boolean | UserCountOutputTypeCountConversationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLessonProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVocabularyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserVocabularyWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExamResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamResultWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }


  /**
   * Count Type LessonCountOutputType
   */

  export type LessonCountOutputType = {
    progress: number
  }

  export type LessonCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | LessonCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonCountOutputType
     */
    select?: LessonCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonProgressWhereInput
  }


  /**
   * Count Type VocabularyCountOutputType
   */

  export type VocabularyCountOutputType = {
    userVocabulary: number
  }

  export type VocabularyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userVocabulary?: boolean | VocabularyCountOutputTypeCountUserVocabularyArgs
  }

  // Custom InputTypes
  /**
   * VocabularyCountOutputType without action
   */
  export type VocabularyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VocabularyCountOutputType
     */
    select?: VocabularyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VocabularyCountOutputType without action
   */
  export type VocabularyCountOutputTypeCountUserVocabularyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserVocabularyWhereInput
  }


  /**
   * Count Type ConversationCountOutputType
   */

  export type ConversationCountOutputType = {
    messages: number
  }

  export type ConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationCountOutputType
     */
    select?: ConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    points: number | null
    streakDays: number | null
    completedLessons: number | null
    dailyGoal: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    points: number | null
    streakDays: number | null
    completedLessons: number | null
    dailyGoal: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    name: string | null
    password: string | null
    level: string | null
    points: number | null
    streakDays: number | null
    joinedAt: Date | null
    completedLessons: number | null
    lastActive: Date | null
    dailyGoal: number | null
    notifications: boolean | null
    theme: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    name: string | null
    password: string | null
    level: string | null
    points: number | null
    streakDays: number | null
    joinedAt: Date | null
    completedLessons: number | null
    lastActive: Date | null
    dailyGoal: number | null
    notifications: boolean | null
    theme: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    level: number
    points: number
    streakDays: number
    joinedAt: number
    learningGoals: number
    completedLessons: number
    lastActive: number
    dailyGoal: number
    notifications: number
    theme: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    points?: true
    streakDays?: true
    completedLessons?: true
    dailyGoal?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    points?: true
    streakDays?: true
    completedLessons?: true
    dailyGoal?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    level?: true
    points?: true
    streakDays?: true
    joinedAt?: true
    completedLessons?: true
    lastActive?: true
    dailyGoal?: true
    notifications?: true
    theme?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    level?: true
    points?: true
    streakDays?: true
    joinedAt?: true
    completedLessons?: true
    lastActive?: true
    dailyGoal?: true
    notifications?: true
    theme?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    level?: true
    points?: true
    streakDays?: true
    joinedAt?: true
    learningGoals?: true
    completedLessons?: true
    lastActive?: true
    dailyGoal?: true
    notifications?: true
    theme?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    name: string
    password: string | null
    level: string
    points: number
    streakDays: number
    joinedAt: Date
    learningGoals: string[]
    completedLessons: number
    lastActive: Date
    dailyGoal: number
    notifications: boolean
    theme: string
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    level?: boolean
    points?: boolean
    streakDays?: boolean
    joinedAt?: boolean
    learningGoals?: boolean
    completedLessons?: boolean
    lastActive?: boolean
    dailyGoal?: boolean
    notifications?: boolean
    theme?: boolean
    lessonProgress?: boolean | User$lessonProgressArgs<ExtArgs>
    vocabulary?: boolean | User$vocabularyArgs<ExtArgs>
    examResults?: boolean | User$examResultsArgs<ExtArgs>
    conversations?: boolean | User$conversationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    level?: boolean
    points?: boolean
    streakDays?: boolean
    joinedAt?: boolean
    learningGoals?: boolean
    completedLessons?: boolean
    lastActive?: boolean
    dailyGoal?: boolean
    notifications?: boolean
    theme?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    level?: boolean
    points?: boolean
    streakDays?: boolean
    joinedAt?: boolean
    learningGoals?: boolean
    completedLessons?: boolean
    lastActive?: boolean
    dailyGoal?: boolean
    notifications?: boolean
    theme?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    level?: boolean
    points?: boolean
    streakDays?: boolean
    joinedAt?: boolean
    learningGoals?: boolean
    completedLessons?: boolean
    lastActive?: boolean
    dailyGoal?: boolean
    notifications?: boolean
    theme?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "level" | "points" | "streakDays" | "joinedAt" | "learningGoals" | "completedLessons" | "lastActive" | "dailyGoal" | "notifications" | "theme", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessonProgress?: boolean | User$lessonProgressArgs<ExtArgs>
    vocabulary?: boolean | User$vocabularyArgs<ExtArgs>
    examResults?: boolean | User$examResultsArgs<ExtArgs>
    conversations?: boolean | User$conversationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      lessonProgress: Prisma.$LessonProgressPayload<ExtArgs>[]
      vocabulary: Prisma.$UserVocabularyPayload<ExtArgs>[]
      examResults: Prisma.$ExamResultPayload<ExtArgs>[]
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      name: string
      password: string | null
      level: string
      points: number
      streakDays: number
      joinedAt: Date
      learningGoals: string[]
      completedLessons: number
      lastActive: Date
      dailyGoal: number
      notifications: boolean
      theme: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lessonProgress<T extends User$lessonProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$lessonProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    vocabulary<T extends User$vocabularyArgs<ExtArgs> = {}>(args?: Subset<T, User$vocabularyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    examResults<T extends User$examResultsArgs<ExtArgs> = {}>(args?: Subset<T, User$examResultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    conversations<T extends User$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, User$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'String'>
    readonly points: FieldRef<"User", 'Int'>
    readonly streakDays: FieldRef<"User", 'Int'>
    readonly joinedAt: FieldRef<"User", 'DateTime'>
    readonly learningGoals: FieldRef<"User", 'String[]'>
    readonly completedLessons: FieldRef<"User", 'Int'>
    readonly lastActive: FieldRef<"User", 'DateTime'>
    readonly dailyGoal: FieldRef<"User", 'Int'>
    readonly notifications: FieldRef<"User", 'Boolean'>
    readonly theme: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.lessonProgress
   */
  export type User$lessonProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    where?: LessonProgressWhereInput
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    cursor?: LessonProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * User.vocabulary
   */
  export type User$vocabularyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    where?: UserVocabularyWhereInput
    orderBy?: UserVocabularyOrderByWithRelationInput | UserVocabularyOrderByWithRelationInput[]
    cursor?: UserVocabularyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserVocabularyScalarFieldEnum | UserVocabularyScalarFieldEnum[]
  }

  /**
   * User.examResults
   */
  export type User$examResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    where?: ExamResultWhereInput
    orderBy?: ExamResultOrderByWithRelationInput | ExamResultOrderByWithRelationInput[]
    cursor?: ExamResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamResultScalarFieldEnum | ExamResultScalarFieldEnum[]
  }

  /**
   * User.conversations
   */
  export type User$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Lesson
   */

  export type AggregateLesson = {
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  export type LessonAvgAggregateOutputType = {
    id: number | null
    duration: number | null
  }

  export type LessonSumAggregateOutputType = {
    id: number | null
    duration: number | null
  }

  export type LessonMinAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    level: string | null
    duration: number | null
  }

  export type LessonMaxAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    level: string | null
    duration: number | null
  }

  export type LessonCountAggregateOutputType = {
    id: number
    title: number
    description: number
    level: number
    duration: number
    topics: number
    content: number
    _all: number
  }


  export type LessonAvgAggregateInputType = {
    id?: true
    duration?: true
  }

  export type LessonSumAggregateInputType = {
    id?: true
    duration?: true
  }

  export type LessonMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    level?: true
    duration?: true
  }

  export type LessonMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    level?: true
    duration?: true
  }

  export type LessonCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    level?: true
    duration?: true
    topics?: true
    content?: true
    _all?: true
  }

  export type LessonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lesson to aggregate.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lessons
    **/
    _count?: true | LessonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonMaxAggregateInputType
  }

  export type GetLessonAggregateType<T extends LessonAggregateArgs> = {
        [P in keyof T & keyof AggregateLesson]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesson[P]>
      : GetScalarType<T[P], AggregateLesson[P]>
  }




  export type LessonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
    orderBy?: LessonOrderByWithAggregationInput | LessonOrderByWithAggregationInput[]
    by: LessonScalarFieldEnum[] | LessonScalarFieldEnum
    having?: LessonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonCountAggregateInputType | true
    _avg?: LessonAvgAggregateInputType
    _sum?: LessonSumAggregateInputType
    _min?: LessonMinAggregateInputType
    _max?: LessonMaxAggregateInputType
  }

  export type LessonGroupByOutputType = {
    id: number
    title: string
    description: string
    level: string
    duration: number
    topics: string[]
    content: JsonValue
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  type GetLessonGroupByPayload<T extends LessonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonGroupByOutputType[P]>
            : GetScalarType<T[P], LessonGroupByOutputType[P]>
        }
      >
    >


  export type LessonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    level?: boolean
    duration?: boolean
    topics?: boolean
    content?: boolean
    progress?: boolean | Lesson$progressArgs<ExtArgs>
    _count?: boolean | LessonCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    level?: boolean
    duration?: boolean
    topics?: boolean
    content?: boolean
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    level?: boolean
    duration?: boolean
    topics?: boolean
    content?: boolean
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    level?: boolean
    duration?: boolean
    topics?: boolean
    content?: boolean
  }

  export type LessonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "level" | "duration" | "topics" | "content", ExtArgs["result"]["lesson"]>
  export type LessonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | Lesson$progressArgs<ExtArgs>
    _count?: boolean | LessonCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LessonIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LessonIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LessonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lesson"
    objects: {
      progress: Prisma.$LessonProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      description: string
      level: string
      duration: number
      topics: string[]
      content: Prisma.JsonValue
    }, ExtArgs["result"]["lesson"]>
    composites: {}
  }

  type LessonGetPayload<S extends boolean | null | undefined | LessonDefaultArgs> = $Result.GetResult<Prisma.$LessonPayload, S>

  type LessonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LessonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LessonCountAggregateInputType | true
    }

  export interface LessonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lesson'], meta: { name: 'Lesson' } }
    /**
     * Find zero or one Lesson that matches the filter.
     * @param {LessonFindUniqueArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LessonFindUniqueArgs>(args: SelectSubset<T, LessonFindUniqueArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lesson that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LessonFindUniqueOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LessonFindUniqueOrThrowArgs>(args: SelectSubset<T, LessonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LessonFindFirstArgs>(args?: SelectSubset<T, LessonFindFirstArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LessonFindFirstOrThrowArgs>(args?: SelectSubset<T, LessonFindFirstOrThrowArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lessons
     * const lessons = await prisma.lesson.findMany()
     * 
     * // Get first 10 Lessons
     * const lessons = await prisma.lesson.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonWithIdOnly = await prisma.lesson.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LessonFindManyArgs>(args?: SelectSubset<T, LessonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lesson.
     * @param {LessonCreateArgs} args - Arguments to create a Lesson.
     * @example
     * // Create one Lesson
     * const Lesson = await prisma.lesson.create({
     *   data: {
     *     // ... data to create a Lesson
     *   }
     * })
     * 
     */
    create<T extends LessonCreateArgs>(args: SelectSubset<T, LessonCreateArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lessons.
     * @param {LessonCreateManyArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LessonCreateManyArgs>(args?: SelectSubset<T, LessonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lessons and returns the data saved in the database.
     * @param {LessonCreateManyAndReturnArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lessons and only return the `id`
     * const lessonWithIdOnly = await prisma.lesson.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LessonCreateManyAndReturnArgs>(args?: SelectSubset<T, LessonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lesson.
     * @param {LessonDeleteArgs} args - Arguments to delete one Lesson.
     * @example
     * // Delete one Lesson
     * const Lesson = await prisma.lesson.delete({
     *   where: {
     *     // ... filter to delete one Lesson
     *   }
     * })
     * 
     */
    delete<T extends LessonDeleteArgs>(args: SelectSubset<T, LessonDeleteArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lesson.
     * @param {LessonUpdateArgs} args - Arguments to update one Lesson.
     * @example
     * // Update one Lesson
     * const lesson = await prisma.lesson.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LessonUpdateArgs>(args: SelectSubset<T, LessonUpdateArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lessons.
     * @param {LessonDeleteManyArgs} args - Arguments to filter Lessons to delete.
     * @example
     * // Delete a few Lessons
     * const { count } = await prisma.lesson.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LessonDeleteManyArgs>(args?: SelectSubset<T, LessonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LessonUpdateManyArgs>(args: SelectSubset<T, LessonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons and returns the data updated in the database.
     * @param {LessonUpdateManyAndReturnArgs} args - Arguments to update many Lessons.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lessons and only return the `id`
     * const lessonWithIdOnly = await prisma.lesson.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LessonUpdateManyAndReturnArgs>(args: SelectSubset<T, LessonUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lesson.
     * @param {LessonUpsertArgs} args - Arguments to update or create a Lesson.
     * @example
     * // Update or create a Lesson
     * const lesson = await prisma.lesson.upsert({
     *   create: {
     *     // ... data to create a Lesson
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesson we want to update
     *   }
     * })
     */
    upsert<T extends LessonUpsertArgs>(args: SelectSubset<T, LessonUpsertArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonCountArgs} args - Arguments to filter Lessons to count.
     * @example
     * // Count the number of Lessons
     * const count = await prisma.lesson.count({
     *   where: {
     *     // ... the filter for the Lessons we want to count
     *   }
     * })
    **/
    count<T extends LessonCountArgs>(
      args?: Subset<T, LessonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LessonAggregateArgs>(args: Subset<T, LessonAggregateArgs>): Prisma.PrismaPromise<GetLessonAggregateType<T>>

    /**
     * Group by Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LessonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LessonGroupByArgs['orderBy'] }
        : { orderBy?: LessonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LessonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lesson model
   */
  readonly fields: LessonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lesson.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LessonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    progress<T extends Lesson$progressArgs<ExtArgs> = {}>(args?: Subset<T, Lesson$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lesson model
   */
  interface LessonFieldRefs {
    readonly id: FieldRef<"Lesson", 'Int'>
    readonly title: FieldRef<"Lesson", 'String'>
    readonly description: FieldRef<"Lesson", 'String'>
    readonly level: FieldRef<"Lesson", 'String'>
    readonly duration: FieldRef<"Lesson", 'Int'>
    readonly topics: FieldRef<"Lesson", 'String[]'>
    readonly content: FieldRef<"Lesson", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Lesson findUnique
   */
  export type LessonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findUniqueOrThrow
   */
  export type LessonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findFirst
   */
  export type LessonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson findFirstOrThrow
   */
  export type LessonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson findMany
   */
  export type LessonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lessons to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson create
   */
  export type LessonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to create a Lesson.
     */
    data: XOR<LessonCreateInput, LessonUncheckedCreateInput>
  }

  /**
   * Lesson createMany
   */
  export type LessonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lessons.
     */
    data: LessonCreateManyInput | LessonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lesson createManyAndReturn
   */
  export type LessonCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * The data used to create many Lessons.
     */
    data: LessonCreateManyInput | LessonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lesson update
   */
  export type LessonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to update a Lesson.
     */
    data: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
    /**
     * Choose, which Lesson to update.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson updateMany
   */
  export type LessonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to update.
     */
    limit?: number
  }

  /**
   * Lesson updateManyAndReturn
   */
  export type LessonUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to update.
     */
    limit?: number
  }

  /**
   * Lesson upsert
   */
  export type LessonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The filter to search for the Lesson to update in case it exists.
     */
    where: LessonWhereUniqueInput
    /**
     * In case the Lesson found by the `where` argument doesn't exist, create a new Lesson with this data.
     */
    create: XOR<LessonCreateInput, LessonUncheckedCreateInput>
    /**
     * In case the Lesson was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
  }

  /**
   * Lesson delete
   */
  export type LessonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter which Lesson to delete.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson deleteMany
   */
  export type LessonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lessons to delete
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to delete.
     */
    limit?: number
  }

  /**
   * Lesson.progress
   */
  export type Lesson$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    where?: LessonProgressWhereInput
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    cursor?: LessonProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * Lesson without action
   */
  export type LessonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
  }


  /**
   * Model LessonProgress
   */

  export type AggregateLessonProgress = {
    _count: LessonProgressCountAggregateOutputType | null
    _avg: LessonProgressAvgAggregateOutputType | null
    _sum: LessonProgressSumAggregateOutputType | null
    _min: LessonProgressMinAggregateOutputType | null
    _max: LessonProgressMaxAggregateOutputType | null
  }

  export type LessonProgressAvgAggregateOutputType = {
    id: number | null
    lessonId: number | null
    userId: number | null
    score: number | null
  }

  export type LessonProgressSumAggregateOutputType = {
    id: number | null
    lessonId: number | null
    userId: number | null
    score: number | null
  }

  export type LessonProgressMinAggregateOutputType = {
    id: number | null
    lessonId: number | null
    userId: number | null
    completed: boolean | null
    score: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type LessonProgressMaxAggregateOutputType = {
    id: number | null
    lessonId: number | null
    userId: number | null
    completed: boolean | null
    score: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type LessonProgressCountAggregateOutputType = {
    id: number
    lessonId: number
    userId: number
    completed: number
    score: number
    startedAt: number
    completedAt: number
    answers: number
    _all: number
  }


  export type LessonProgressAvgAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    score?: true
  }

  export type LessonProgressSumAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    score?: true
  }

  export type LessonProgressMinAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    completed?: true
    score?: true
    startedAt?: true
    completedAt?: true
  }

  export type LessonProgressMaxAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    completed?: true
    score?: true
    startedAt?: true
    completedAt?: true
  }

  export type LessonProgressCountAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    completed?: true
    score?: true
    startedAt?: true
    completedAt?: true
    answers?: true
    _all?: true
  }

  export type LessonProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LessonProgress to aggregate.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LessonProgresses
    **/
    _count?: true | LessonProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonProgressMaxAggregateInputType
  }

  export type GetLessonProgressAggregateType<T extends LessonProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateLessonProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLessonProgress[P]>
      : GetScalarType<T[P], AggregateLessonProgress[P]>
  }




  export type LessonProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonProgressWhereInput
    orderBy?: LessonProgressOrderByWithAggregationInput | LessonProgressOrderByWithAggregationInput[]
    by: LessonProgressScalarFieldEnum[] | LessonProgressScalarFieldEnum
    having?: LessonProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonProgressCountAggregateInputType | true
    _avg?: LessonProgressAvgAggregateInputType
    _sum?: LessonProgressSumAggregateInputType
    _min?: LessonProgressMinAggregateInputType
    _max?: LessonProgressMaxAggregateInputType
  }

  export type LessonProgressGroupByOutputType = {
    id: number
    lessonId: number
    userId: number
    completed: boolean
    score: number
    startedAt: Date | null
    completedAt: Date | null
    answers: JsonValue | null
    _count: LessonProgressCountAggregateOutputType | null
    _avg: LessonProgressAvgAggregateOutputType | null
    _sum: LessonProgressSumAggregateOutputType | null
    _min: LessonProgressMinAggregateOutputType | null
    _max: LessonProgressMaxAggregateOutputType | null
  }

  type GetLessonProgressGroupByPayload<T extends LessonProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonProgressGroupByOutputType[P]>
            : GetScalarType<T[P], LessonProgressGroupByOutputType[P]>
        }
      >
    >


  export type LessonProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    score?: boolean
    startedAt?: boolean
    completedAt?: boolean
    answers?: boolean
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessonProgress"]>

  export type LessonProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    score?: boolean
    startedAt?: boolean
    completedAt?: boolean
    answers?: boolean
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessonProgress"]>

  export type LessonProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    score?: boolean
    startedAt?: boolean
    completedAt?: boolean
    answers?: boolean
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessonProgress"]>

  export type LessonProgressSelectScalar = {
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    score?: boolean
    startedAt?: boolean
    completedAt?: boolean
    answers?: boolean
  }

  export type LessonProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lessonId" | "userId" | "completed" | "score" | "startedAt" | "completedAt" | "answers", ExtArgs["result"]["lessonProgress"]>
  export type LessonProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LessonProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LessonProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LessonProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LessonProgress"
    objects: {
      lesson: Prisma.$LessonPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      lessonId: number
      userId: number
      completed: boolean
      score: number
      startedAt: Date | null
      completedAt: Date | null
      answers: Prisma.JsonValue | null
    }, ExtArgs["result"]["lessonProgress"]>
    composites: {}
  }

  type LessonProgressGetPayload<S extends boolean | null | undefined | LessonProgressDefaultArgs> = $Result.GetResult<Prisma.$LessonProgressPayload, S>

  type LessonProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LessonProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LessonProgressCountAggregateInputType | true
    }

  export interface LessonProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LessonProgress'], meta: { name: 'LessonProgress' } }
    /**
     * Find zero or one LessonProgress that matches the filter.
     * @param {LessonProgressFindUniqueArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LessonProgressFindUniqueArgs>(args: SelectSubset<T, LessonProgressFindUniqueArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LessonProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LessonProgressFindUniqueOrThrowArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LessonProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, LessonProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LessonProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressFindFirstArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LessonProgressFindFirstArgs>(args?: SelectSubset<T, LessonProgressFindFirstArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LessonProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressFindFirstOrThrowArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LessonProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, LessonProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LessonProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LessonProgresses
     * const lessonProgresses = await prisma.lessonProgress.findMany()
     * 
     * // Get first 10 LessonProgresses
     * const lessonProgresses = await prisma.lessonProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonProgressWithIdOnly = await prisma.lessonProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LessonProgressFindManyArgs>(args?: SelectSubset<T, LessonProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LessonProgress.
     * @param {LessonProgressCreateArgs} args - Arguments to create a LessonProgress.
     * @example
     * // Create one LessonProgress
     * const LessonProgress = await prisma.lessonProgress.create({
     *   data: {
     *     // ... data to create a LessonProgress
     *   }
     * })
     * 
     */
    create<T extends LessonProgressCreateArgs>(args: SelectSubset<T, LessonProgressCreateArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LessonProgresses.
     * @param {LessonProgressCreateManyArgs} args - Arguments to create many LessonProgresses.
     * @example
     * // Create many LessonProgresses
     * const lessonProgress = await prisma.lessonProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LessonProgressCreateManyArgs>(args?: SelectSubset<T, LessonProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LessonProgresses and returns the data saved in the database.
     * @param {LessonProgressCreateManyAndReturnArgs} args - Arguments to create many LessonProgresses.
     * @example
     * // Create many LessonProgresses
     * const lessonProgress = await prisma.lessonProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LessonProgresses and only return the `id`
     * const lessonProgressWithIdOnly = await prisma.lessonProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LessonProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, LessonProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LessonProgress.
     * @param {LessonProgressDeleteArgs} args - Arguments to delete one LessonProgress.
     * @example
     * // Delete one LessonProgress
     * const LessonProgress = await prisma.lessonProgress.delete({
     *   where: {
     *     // ... filter to delete one LessonProgress
     *   }
     * })
     * 
     */
    delete<T extends LessonProgressDeleteArgs>(args: SelectSubset<T, LessonProgressDeleteArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LessonProgress.
     * @param {LessonProgressUpdateArgs} args - Arguments to update one LessonProgress.
     * @example
     * // Update one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LessonProgressUpdateArgs>(args: SelectSubset<T, LessonProgressUpdateArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LessonProgresses.
     * @param {LessonProgressDeleteManyArgs} args - Arguments to filter LessonProgresses to delete.
     * @example
     * // Delete a few LessonProgresses
     * const { count } = await prisma.lessonProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LessonProgressDeleteManyArgs>(args?: SelectSubset<T, LessonProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LessonProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LessonProgresses
     * const lessonProgress = await prisma.lessonProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LessonProgressUpdateManyArgs>(args: SelectSubset<T, LessonProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LessonProgresses and returns the data updated in the database.
     * @param {LessonProgressUpdateManyAndReturnArgs} args - Arguments to update many LessonProgresses.
     * @example
     * // Update many LessonProgresses
     * const lessonProgress = await prisma.lessonProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LessonProgresses and only return the `id`
     * const lessonProgressWithIdOnly = await prisma.lessonProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LessonProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, LessonProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LessonProgress.
     * @param {LessonProgressUpsertArgs} args - Arguments to update or create a LessonProgress.
     * @example
     * // Update or create a LessonProgress
     * const lessonProgress = await prisma.lessonProgress.upsert({
     *   create: {
     *     // ... data to create a LessonProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LessonProgress we want to update
     *   }
     * })
     */
    upsert<T extends LessonProgressUpsertArgs>(args: SelectSubset<T, LessonProgressUpsertArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LessonProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressCountArgs} args - Arguments to filter LessonProgresses to count.
     * @example
     * // Count the number of LessonProgresses
     * const count = await prisma.lessonProgress.count({
     *   where: {
     *     // ... the filter for the LessonProgresses we want to count
     *   }
     * })
    **/
    count<T extends LessonProgressCountArgs>(
      args?: Subset<T, LessonProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LessonProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LessonProgressAggregateArgs>(args: Subset<T, LessonProgressAggregateArgs>): Prisma.PrismaPromise<GetLessonProgressAggregateType<T>>

    /**
     * Group by LessonProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LessonProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LessonProgressGroupByArgs['orderBy'] }
        : { orderBy?: LessonProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LessonProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LessonProgress model
   */
  readonly fields: LessonProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LessonProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LessonProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lesson<T extends LessonDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LessonDefaultArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LessonProgress model
   */
  interface LessonProgressFieldRefs {
    readonly id: FieldRef<"LessonProgress", 'Int'>
    readonly lessonId: FieldRef<"LessonProgress", 'Int'>
    readonly userId: FieldRef<"LessonProgress", 'Int'>
    readonly completed: FieldRef<"LessonProgress", 'Boolean'>
    readonly score: FieldRef<"LessonProgress", 'Int'>
    readonly startedAt: FieldRef<"LessonProgress", 'DateTime'>
    readonly completedAt: FieldRef<"LessonProgress", 'DateTime'>
    readonly answers: FieldRef<"LessonProgress", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * LessonProgress findUnique
   */
  export type LessonProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress findUniqueOrThrow
   */
  export type LessonProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress findFirst
   */
  export type LessonProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LessonProgresses.
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LessonProgresses.
     */
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * LessonProgress findFirstOrThrow
   */
  export type LessonProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LessonProgresses.
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LessonProgresses.
     */
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * LessonProgress findMany
   */
  export type LessonProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgresses to fetch.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LessonProgresses.
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * LessonProgress create
   */
  export type LessonProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a LessonProgress.
     */
    data: XOR<LessonProgressCreateInput, LessonProgressUncheckedCreateInput>
  }

  /**
   * LessonProgress createMany
   */
  export type LessonProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LessonProgresses.
     */
    data: LessonProgressCreateManyInput | LessonProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LessonProgress createManyAndReturn
   */
  export type LessonProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * The data used to create many LessonProgresses.
     */
    data: LessonProgressCreateManyInput | LessonProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LessonProgress update
   */
  export type LessonProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a LessonProgress.
     */
    data: XOR<LessonProgressUpdateInput, LessonProgressUncheckedUpdateInput>
    /**
     * Choose, which LessonProgress to update.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress updateMany
   */
  export type LessonProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LessonProgresses.
     */
    data: XOR<LessonProgressUpdateManyMutationInput, LessonProgressUncheckedUpdateManyInput>
    /**
     * Filter which LessonProgresses to update
     */
    where?: LessonProgressWhereInput
    /**
     * Limit how many LessonProgresses to update.
     */
    limit?: number
  }

  /**
   * LessonProgress updateManyAndReturn
   */
  export type LessonProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * The data used to update LessonProgresses.
     */
    data: XOR<LessonProgressUpdateManyMutationInput, LessonProgressUncheckedUpdateManyInput>
    /**
     * Filter which LessonProgresses to update
     */
    where?: LessonProgressWhereInput
    /**
     * Limit how many LessonProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LessonProgress upsert
   */
  export type LessonProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the LessonProgress to update in case it exists.
     */
    where: LessonProgressWhereUniqueInput
    /**
     * In case the LessonProgress found by the `where` argument doesn't exist, create a new LessonProgress with this data.
     */
    create: XOR<LessonProgressCreateInput, LessonProgressUncheckedCreateInput>
    /**
     * In case the LessonProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LessonProgressUpdateInput, LessonProgressUncheckedUpdateInput>
  }

  /**
   * LessonProgress delete
   */
  export type LessonProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter which LessonProgress to delete.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress deleteMany
   */
  export type LessonProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LessonProgresses to delete
     */
    where?: LessonProgressWhereInput
    /**
     * Limit how many LessonProgresses to delete.
     */
    limit?: number
  }

  /**
   * LessonProgress without action
   */
  export type LessonProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
  }


  /**
   * Model Vocabulary
   */

  export type AggregateVocabulary = {
    _count: VocabularyCountAggregateOutputType | null
    _avg: VocabularyAvgAggregateOutputType | null
    _sum: VocabularySumAggregateOutputType | null
    _min: VocabularyMinAggregateOutputType | null
    _max: VocabularyMaxAggregateOutputType | null
  }

  export type VocabularyAvgAggregateOutputType = {
    id: number | null
  }

  export type VocabularySumAggregateOutputType = {
    id: number | null
  }

  export type VocabularyMinAggregateOutputType = {
    id: number | null
    word: string | null
    translation: string | null
    example: string | null
    level: string | null
  }

  export type VocabularyMaxAggregateOutputType = {
    id: number | null
    word: string | null
    translation: string | null
    example: string | null
    level: string | null
  }

  export type VocabularyCountAggregateOutputType = {
    id: number
    word: number
    translation: number
    example: number
    level: number
    _all: number
  }


  export type VocabularyAvgAggregateInputType = {
    id?: true
  }

  export type VocabularySumAggregateInputType = {
    id?: true
  }

  export type VocabularyMinAggregateInputType = {
    id?: true
    word?: true
    translation?: true
    example?: true
    level?: true
  }

  export type VocabularyMaxAggregateInputType = {
    id?: true
    word?: true
    translation?: true
    example?: true
    level?: true
  }

  export type VocabularyCountAggregateInputType = {
    id?: true
    word?: true
    translation?: true
    example?: true
    level?: true
    _all?: true
  }

  export type VocabularyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vocabulary to aggregate.
     */
    where?: VocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vocabularies to fetch.
     */
    orderBy?: VocabularyOrderByWithRelationInput | VocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vocabularies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vocabularies
    **/
    _count?: true | VocabularyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VocabularyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VocabularySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VocabularyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VocabularyMaxAggregateInputType
  }

  export type GetVocabularyAggregateType<T extends VocabularyAggregateArgs> = {
        [P in keyof T & keyof AggregateVocabulary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVocabulary[P]>
      : GetScalarType<T[P], AggregateVocabulary[P]>
  }




  export type VocabularyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VocabularyWhereInput
    orderBy?: VocabularyOrderByWithAggregationInput | VocabularyOrderByWithAggregationInput[]
    by: VocabularyScalarFieldEnum[] | VocabularyScalarFieldEnum
    having?: VocabularyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VocabularyCountAggregateInputType | true
    _avg?: VocabularyAvgAggregateInputType
    _sum?: VocabularySumAggregateInputType
    _min?: VocabularyMinAggregateInputType
    _max?: VocabularyMaxAggregateInputType
  }

  export type VocabularyGroupByOutputType = {
    id: number
    word: string
    translation: string
    example: string
    level: string
    _count: VocabularyCountAggregateOutputType | null
    _avg: VocabularyAvgAggregateOutputType | null
    _sum: VocabularySumAggregateOutputType | null
    _min: VocabularyMinAggregateOutputType | null
    _max: VocabularyMaxAggregateOutputType | null
  }

  type GetVocabularyGroupByPayload<T extends VocabularyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VocabularyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VocabularyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VocabularyGroupByOutputType[P]>
            : GetScalarType<T[P], VocabularyGroupByOutputType[P]>
        }
      >
    >


  export type VocabularySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    word?: boolean
    translation?: boolean
    example?: boolean
    level?: boolean
    userVocabulary?: boolean | Vocabulary$userVocabularyArgs<ExtArgs>
    _count?: boolean | VocabularyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vocabulary"]>

  export type VocabularySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    word?: boolean
    translation?: boolean
    example?: boolean
    level?: boolean
  }, ExtArgs["result"]["vocabulary"]>

  export type VocabularySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    word?: boolean
    translation?: boolean
    example?: boolean
    level?: boolean
  }, ExtArgs["result"]["vocabulary"]>

  export type VocabularySelectScalar = {
    id?: boolean
    word?: boolean
    translation?: boolean
    example?: boolean
    level?: boolean
  }

  export type VocabularyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "word" | "translation" | "example" | "level", ExtArgs["result"]["vocabulary"]>
  export type VocabularyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userVocabulary?: boolean | Vocabulary$userVocabularyArgs<ExtArgs>
    _count?: boolean | VocabularyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VocabularyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VocabularyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VocabularyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vocabulary"
    objects: {
      userVocabulary: Prisma.$UserVocabularyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      word: string
      translation: string
      example: string
      level: string
    }, ExtArgs["result"]["vocabulary"]>
    composites: {}
  }

  type VocabularyGetPayload<S extends boolean | null | undefined | VocabularyDefaultArgs> = $Result.GetResult<Prisma.$VocabularyPayload, S>

  type VocabularyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VocabularyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VocabularyCountAggregateInputType | true
    }

  export interface VocabularyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vocabulary'], meta: { name: 'Vocabulary' } }
    /**
     * Find zero or one Vocabulary that matches the filter.
     * @param {VocabularyFindUniqueArgs} args - Arguments to find a Vocabulary
     * @example
     * // Get one Vocabulary
     * const vocabulary = await prisma.vocabulary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VocabularyFindUniqueArgs>(args: SelectSubset<T, VocabularyFindUniqueArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vocabulary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VocabularyFindUniqueOrThrowArgs} args - Arguments to find a Vocabulary
     * @example
     * // Get one Vocabulary
     * const vocabulary = await prisma.vocabulary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VocabularyFindUniqueOrThrowArgs>(args: SelectSubset<T, VocabularyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vocabulary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyFindFirstArgs} args - Arguments to find a Vocabulary
     * @example
     * // Get one Vocabulary
     * const vocabulary = await prisma.vocabulary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VocabularyFindFirstArgs>(args?: SelectSubset<T, VocabularyFindFirstArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vocabulary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyFindFirstOrThrowArgs} args - Arguments to find a Vocabulary
     * @example
     * // Get one Vocabulary
     * const vocabulary = await prisma.vocabulary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VocabularyFindFirstOrThrowArgs>(args?: SelectSubset<T, VocabularyFindFirstOrThrowArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vocabularies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vocabularies
     * const vocabularies = await prisma.vocabulary.findMany()
     * 
     * // Get first 10 Vocabularies
     * const vocabularies = await prisma.vocabulary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vocabularyWithIdOnly = await prisma.vocabulary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VocabularyFindManyArgs>(args?: SelectSubset<T, VocabularyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vocabulary.
     * @param {VocabularyCreateArgs} args - Arguments to create a Vocabulary.
     * @example
     * // Create one Vocabulary
     * const Vocabulary = await prisma.vocabulary.create({
     *   data: {
     *     // ... data to create a Vocabulary
     *   }
     * })
     * 
     */
    create<T extends VocabularyCreateArgs>(args: SelectSubset<T, VocabularyCreateArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vocabularies.
     * @param {VocabularyCreateManyArgs} args - Arguments to create many Vocabularies.
     * @example
     * // Create many Vocabularies
     * const vocabulary = await prisma.vocabulary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VocabularyCreateManyArgs>(args?: SelectSubset<T, VocabularyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vocabularies and returns the data saved in the database.
     * @param {VocabularyCreateManyAndReturnArgs} args - Arguments to create many Vocabularies.
     * @example
     * // Create many Vocabularies
     * const vocabulary = await prisma.vocabulary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vocabularies and only return the `id`
     * const vocabularyWithIdOnly = await prisma.vocabulary.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VocabularyCreateManyAndReturnArgs>(args?: SelectSubset<T, VocabularyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vocabulary.
     * @param {VocabularyDeleteArgs} args - Arguments to delete one Vocabulary.
     * @example
     * // Delete one Vocabulary
     * const Vocabulary = await prisma.vocabulary.delete({
     *   where: {
     *     // ... filter to delete one Vocabulary
     *   }
     * })
     * 
     */
    delete<T extends VocabularyDeleteArgs>(args: SelectSubset<T, VocabularyDeleteArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vocabulary.
     * @param {VocabularyUpdateArgs} args - Arguments to update one Vocabulary.
     * @example
     * // Update one Vocabulary
     * const vocabulary = await prisma.vocabulary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VocabularyUpdateArgs>(args: SelectSubset<T, VocabularyUpdateArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vocabularies.
     * @param {VocabularyDeleteManyArgs} args - Arguments to filter Vocabularies to delete.
     * @example
     * // Delete a few Vocabularies
     * const { count } = await prisma.vocabulary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VocabularyDeleteManyArgs>(args?: SelectSubset<T, VocabularyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vocabularies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vocabularies
     * const vocabulary = await prisma.vocabulary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VocabularyUpdateManyArgs>(args: SelectSubset<T, VocabularyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vocabularies and returns the data updated in the database.
     * @param {VocabularyUpdateManyAndReturnArgs} args - Arguments to update many Vocabularies.
     * @example
     * // Update many Vocabularies
     * const vocabulary = await prisma.vocabulary.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vocabularies and only return the `id`
     * const vocabularyWithIdOnly = await prisma.vocabulary.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VocabularyUpdateManyAndReturnArgs>(args: SelectSubset<T, VocabularyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vocabulary.
     * @param {VocabularyUpsertArgs} args - Arguments to update or create a Vocabulary.
     * @example
     * // Update or create a Vocabulary
     * const vocabulary = await prisma.vocabulary.upsert({
     *   create: {
     *     // ... data to create a Vocabulary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vocabulary we want to update
     *   }
     * })
     */
    upsert<T extends VocabularyUpsertArgs>(args: SelectSubset<T, VocabularyUpsertArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vocabularies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyCountArgs} args - Arguments to filter Vocabularies to count.
     * @example
     * // Count the number of Vocabularies
     * const count = await prisma.vocabulary.count({
     *   where: {
     *     // ... the filter for the Vocabularies we want to count
     *   }
     * })
    **/
    count<T extends VocabularyCountArgs>(
      args?: Subset<T, VocabularyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VocabularyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vocabulary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VocabularyAggregateArgs>(args: Subset<T, VocabularyAggregateArgs>): Prisma.PrismaPromise<GetVocabularyAggregateType<T>>

    /**
     * Group by Vocabulary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VocabularyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VocabularyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VocabularyGroupByArgs['orderBy'] }
        : { orderBy?: VocabularyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VocabularyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVocabularyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vocabulary model
   */
  readonly fields: VocabularyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vocabulary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VocabularyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userVocabulary<T extends Vocabulary$userVocabularyArgs<ExtArgs> = {}>(args?: Subset<T, Vocabulary$userVocabularyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vocabulary model
   */
  interface VocabularyFieldRefs {
    readonly id: FieldRef<"Vocabulary", 'Int'>
    readonly word: FieldRef<"Vocabulary", 'String'>
    readonly translation: FieldRef<"Vocabulary", 'String'>
    readonly example: FieldRef<"Vocabulary", 'String'>
    readonly level: FieldRef<"Vocabulary", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Vocabulary findUnique
   */
  export type VocabularyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * Filter, which Vocabulary to fetch.
     */
    where: VocabularyWhereUniqueInput
  }

  /**
   * Vocabulary findUniqueOrThrow
   */
  export type VocabularyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * Filter, which Vocabulary to fetch.
     */
    where: VocabularyWhereUniqueInput
  }

  /**
   * Vocabulary findFirst
   */
  export type VocabularyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * Filter, which Vocabulary to fetch.
     */
    where?: VocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vocabularies to fetch.
     */
    orderBy?: VocabularyOrderByWithRelationInput | VocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vocabularies.
     */
    cursor?: VocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vocabularies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vocabularies.
     */
    distinct?: VocabularyScalarFieldEnum | VocabularyScalarFieldEnum[]
  }

  /**
   * Vocabulary findFirstOrThrow
   */
  export type VocabularyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * Filter, which Vocabulary to fetch.
     */
    where?: VocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vocabularies to fetch.
     */
    orderBy?: VocabularyOrderByWithRelationInput | VocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vocabularies.
     */
    cursor?: VocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vocabularies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vocabularies.
     */
    distinct?: VocabularyScalarFieldEnum | VocabularyScalarFieldEnum[]
  }

  /**
   * Vocabulary findMany
   */
  export type VocabularyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * Filter, which Vocabularies to fetch.
     */
    where?: VocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vocabularies to fetch.
     */
    orderBy?: VocabularyOrderByWithRelationInput | VocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vocabularies.
     */
    cursor?: VocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vocabularies.
     */
    skip?: number
    distinct?: VocabularyScalarFieldEnum | VocabularyScalarFieldEnum[]
  }

  /**
   * Vocabulary create
   */
  export type VocabularyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * The data needed to create a Vocabulary.
     */
    data: XOR<VocabularyCreateInput, VocabularyUncheckedCreateInput>
  }

  /**
   * Vocabulary createMany
   */
  export type VocabularyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vocabularies.
     */
    data: VocabularyCreateManyInput | VocabularyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vocabulary createManyAndReturn
   */
  export type VocabularyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * The data used to create many Vocabularies.
     */
    data: VocabularyCreateManyInput | VocabularyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vocabulary update
   */
  export type VocabularyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * The data needed to update a Vocabulary.
     */
    data: XOR<VocabularyUpdateInput, VocabularyUncheckedUpdateInput>
    /**
     * Choose, which Vocabulary to update.
     */
    where: VocabularyWhereUniqueInput
  }

  /**
   * Vocabulary updateMany
   */
  export type VocabularyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vocabularies.
     */
    data: XOR<VocabularyUpdateManyMutationInput, VocabularyUncheckedUpdateManyInput>
    /**
     * Filter which Vocabularies to update
     */
    where?: VocabularyWhereInput
    /**
     * Limit how many Vocabularies to update.
     */
    limit?: number
  }

  /**
   * Vocabulary updateManyAndReturn
   */
  export type VocabularyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * The data used to update Vocabularies.
     */
    data: XOR<VocabularyUpdateManyMutationInput, VocabularyUncheckedUpdateManyInput>
    /**
     * Filter which Vocabularies to update
     */
    where?: VocabularyWhereInput
    /**
     * Limit how many Vocabularies to update.
     */
    limit?: number
  }

  /**
   * Vocabulary upsert
   */
  export type VocabularyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * The filter to search for the Vocabulary to update in case it exists.
     */
    where: VocabularyWhereUniqueInput
    /**
     * In case the Vocabulary found by the `where` argument doesn't exist, create a new Vocabulary with this data.
     */
    create: XOR<VocabularyCreateInput, VocabularyUncheckedCreateInput>
    /**
     * In case the Vocabulary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VocabularyUpdateInput, VocabularyUncheckedUpdateInput>
  }

  /**
   * Vocabulary delete
   */
  export type VocabularyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
    /**
     * Filter which Vocabulary to delete.
     */
    where: VocabularyWhereUniqueInput
  }

  /**
   * Vocabulary deleteMany
   */
  export type VocabularyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vocabularies to delete
     */
    where?: VocabularyWhereInput
    /**
     * Limit how many Vocabularies to delete.
     */
    limit?: number
  }

  /**
   * Vocabulary.userVocabulary
   */
  export type Vocabulary$userVocabularyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    where?: UserVocabularyWhereInput
    orderBy?: UserVocabularyOrderByWithRelationInput | UserVocabularyOrderByWithRelationInput[]
    cursor?: UserVocabularyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserVocabularyScalarFieldEnum | UserVocabularyScalarFieldEnum[]
  }

  /**
   * Vocabulary without action
   */
  export type VocabularyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vocabulary
     */
    select?: VocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vocabulary
     */
    omit?: VocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VocabularyInclude<ExtArgs> | null
  }


  /**
   * Model UserVocabulary
   */

  export type AggregateUserVocabulary = {
    _count: UserVocabularyCountAggregateOutputType | null
    _avg: UserVocabularyAvgAggregateOutputType | null
    _sum: UserVocabularySumAggregateOutputType | null
    _min: UserVocabularyMinAggregateOutputType | null
    _max: UserVocabularyMaxAggregateOutputType | null
  }

  export type UserVocabularyAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    vocabularyId: number | null
  }

  export type UserVocabularySumAggregateOutputType = {
    id: number | null
    userId: number | null
    vocabularyId: number | null
  }

  export type UserVocabularyMinAggregateOutputType = {
    id: number | null
    userId: number | null
    vocabularyId: number | null
    learned: boolean | null
    lastPracticed: Date | null
  }

  export type UserVocabularyMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    vocabularyId: number | null
    learned: boolean | null
    lastPracticed: Date | null
  }

  export type UserVocabularyCountAggregateOutputType = {
    id: number
    userId: number
    vocabularyId: number
    learned: number
    lastPracticed: number
    _all: number
  }


  export type UserVocabularyAvgAggregateInputType = {
    id?: true
    userId?: true
    vocabularyId?: true
  }

  export type UserVocabularySumAggregateInputType = {
    id?: true
    userId?: true
    vocabularyId?: true
  }

  export type UserVocabularyMinAggregateInputType = {
    id?: true
    userId?: true
    vocabularyId?: true
    learned?: true
    lastPracticed?: true
  }

  export type UserVocabularyMaxAggregateInputType = {
    id?: true
    userId?: true
    vocabularyId?: true
    learned?: true
    lastPracticed?: true
  }

  export type UserVocabularyCountAggregateInputType = {
    id?: true
    userId?: true
    vocabularyId?: true
    learned?: true
    lastPracticed?: true
    _all?: true
  }

  export type UserVocabularyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserVocabulary to aggregate.
     */
    where?: UserVocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserVocabularies to fetch.
     */
    orderBy?: UserVocabularyOrderByWithRelationInput | UserVocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserVocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserVocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserVocabularies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserVocabularies
    **/
    _count?: true | UserVocabularyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserVocabularyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserVocabularySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserVocabularyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserVocabularyMaxAggregateInputType
  }

  export type GetUserVocabularyAggregateType<T extends UserVocabularyAggregateArgs> = {
        [P in keyof T & keyof AggregateUserVocabulary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserVocabulary[P]>
      : GetScalarType<T[P], AggregateUserVocabulary[P]>
  }




  export type UserVocabularyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserVocabularyWhereInput
    orderBy?: UserVocabularyOrderByWithAggregationInput | UserVocabularyOrderByWithAggregationInput[]
    by: UserVocabularyScalarFieldEnum[] | UserVocabularyScalarFieldEnum
    having?: UserVocabularyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserVocabularyCountAggregateInputType | true
    _avg?: UserVocabularyAvgAggregateInputType
    _sum?: UserVocabularySumAggregateInputType
    _min?: UserVocabularyMinAggregateInputType
    _max?: UserVocabularyMaxAggregateInputType
  }

  export type UserVocabularyGroupByOutputType = {
    id: number
    userId: number
    vocabularyId: number
    learned: boolean
    lastPracticed: Date | null
    _count: UserVocabularyCountAggregateOutputType | null
    _avg: UserVocabularyAvgAggregateOutputType | null
    _sum: UserVocabularySumAggregateOutputType | null
    _min: UserVocabularyMinAggregateOutputType | null
    _max: UserVocabularyMaxAggregateOutputType | null
  }

  type GetUserVocabularyGroupByPayload<T extends UserVocabularyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserVocabularyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserVocabularyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserVocabularyGroupByOutputType[P]>
            : GetScalarType<T[P], UserVocabularyGroupByOutputType[P]>
        }
      >
    >


  export type UserVocabularySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    vocabularyId?: boolean
    learned?: boolean
    lastPracticed?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    vocabulary?: boolean | VocabularyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userVocabulary"]>

  export type UserVocabularySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    vocabularyId?: boolean
    learned?: boolean
    lastPracticed?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    vocabulary?: boolean | VocabularyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userVocabulary"]>

  export type UserVocabularySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    vocabularyId?: boolean
    learned?: boolean
    lastPracticed?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    vocabulary?: boolean | VocabularyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userVocabulary"]>

  export type UserVocabularySelectScalar = {
    id?: boolean
    userId?: boolean
    vocabularyId?: boolean
    learned?: boolean
    lastPracticed?: boolean
  }

  export type UserVocabularyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "vocabularyId" | "learned" | "lastPracticed", ExtArgs["result"]["userVocabulary"]>
  export type UserVocabularyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    vocabulary?: boolean | VocabularyDefaultArgs<ExtArgs>
  }
  export type UserVocabularyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    vocabulary?: boolean | VocabularyDefaultArgs<ExtArgs>
  }
  export type UserVocabularyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    vocabulary?: boolean | VocabularyDefaultArgs<ExtArgs>
  }

  export type $UserVocabularyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserVocabulary"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      vocabulary: Prisma.$VocabularyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      vocabularyId: number
      learned: boolean
      lastPracticed: Date | null
    }, ExtArgs["result"]["userVocabulary"]>
    composites: {}
  }

  type UserVocabularyGetPayload<S extends boolean | null | undefined | UserVocabularyDefaultArgs> = $Result.GetResult<Prisma.$UserVocabularyPayload, S>

  type UserVocabularyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserVocabularyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserVocabularyCountAggregateInputType | true
    }

  export interface UserVocabularyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserVocabulary'], meta: { name: 'UserVocabulary' } }
    /**
     * Find zero or one UserVocabulary that matches the filter.
     * @param {UserVocabularyFindUniqueArgs} args - Arguments to find a UserVocabulary
     * @example
     * // Get one UserVocabulary
     * const userVocabulary = await prisma.userVocabulary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserVocabularyFindUniqueArgs>(args: SelectSubset<T, UserVocabularyFindUniqueArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserVocabulary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserVocabularyFindUniqueOrThrowArgs} args - Arguments to find a UserVocabulary
     * @example
     * // Get one UserVocabulary
     * const userVocabulary = await prisma.userVocabulary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserVocabularyFindUniqueOrThrowArgs>(args: SelectSubset<T, UserVocabularyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserVocabulary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyFindFirstArgs} args - Arguments to find a UserVocabulary
     * @example
     * // Get one UserVocabulary
     * const userVocabulary = await prisma.userVocabulary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserVocabularyFindFirstArgs>(args?: SelectSubset<T, UserVocabularyFindFirstArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserVocabulary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyFindFirstOrThrowArgs} args - Arguments to find a UserVocabulary
     * @example
     * // Get one UserVocabulary
     * const userVocabulary = await prisma.userVocabulary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserVocabularyFindFirstOrThrowArgs>(args?: SelectSubset<T, UserVocabularyFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserVocabularies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserVocabularies
     * const userVocabularies = await prisma.userVocabulary.findMany()
     * 
     * // Get first 10 UserVocabularies
     * const userVocabularies = await prisma.userVocabulary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userVocabularyWithIdOnly = await prisma.userVocabulary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserVocabularyFindManyArgs>(args?: SelectSubset<T, UserVocabularyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserVocabulary.
     * @param {UserVocabularyCreateArgs} args - Arguments to create a UserVocabulary.
     * @example
     * // Create one UserVocabulary
     * const UserVocabulary = await prisma.userVocabulary.create({
     *   data: {
     *     // ... data to create a UserVocabulary
     *   }
     * })
     * 
     */
    create<T extends UserVocabularyCreateArgs>(args: SelectSubset<T, UserVocabularyCreateArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserVocabularies.
     * @param {UserVocabularyCreateManyArgs} args - Arguments to create many UserVocabularies.
     * @example
     * // Create many UserVocabularies
     * const userVocabulary = await prisma.userVocabulary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserVocabularyCreateManyArgs>(args?: SelectSubset<T, UserVocabularyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserVocabularies and returns the data saved in the database.
     * @param {UserVocabularyCreateManyAndReturnArgs} args - Arguments to create many UserVocabularies.
     * @example
     * // Create many UserVocabularies
     * const userVocabulary = await prisma.userVocabulary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserVocabularies and only return the `id`
     * const userVocabularyWithIdOnly = await prisma.userVocabulary.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserVocabularyCreateManyAndReturnArgs>(args?: SelectSubset<T, UserVocabularyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserVocabulary.
     * @param {UserVocabularyDeleteArgs} args - Arguments to delete one UserVocabulary.
     * @example
     * // Delete one UserVocabulary
     * const UserVocabulary = await prisma.userVocabulary.delete({
     *   where: {
     *     // ... filter to delete one UserVocabulary
     *   }
     * })
     * 
     */
    delete<T extends UserVocabularyDeleteArgs>(args: SelectSubset<T, UserVocabularyDeleteArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserVocabulary.
     * @param {UserVocabularyUpdateArgs} args - Arguments to update one UserVocabulary.
     * @example
     * // Update one UserVocabulary
     * const userVocabulary = await prisma.userVocabulary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserVocabularyUpdateArgs>(args: SelectSubset<T, UserVocabularyUpdateArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserVocabularies.
     * @param {UserVocabularyDeleteManyArgs} args - Arguments to filter UserVocabularies to delete.
     * @example
     * // Delete a few UserVocabularies
     * const { count } = await prisma.userVocabulary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserVocabularyDeleteManyArgs>(args?: SelectSubset<T, UserVocabularyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserVocabularies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserVocabularies
     * const userVocabulary = await prisma.userVocabulary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserVocabularyUpdateManyArgs>(args: SelectSubset<T, UserVocabularyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserVocabularies and returns the data updated in the database.
     * @param {UserVocabularyUpdateManyAndReturnArgs} args - Arguments to update many UserVocabularies.
     * @example
     * // Update many UserVocabularies
     * const userVocabulary = await prisma.userVocabulary.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserVocabularies and only return the `id`
     * const userVocabularyWithIdOnly = await prisma.userVocabulary.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserVocabularyUpdateManyAndReturnArgs>(args: SelectSubset<T, UserVocabularyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserVocabulary.
     * @param {UserVocabularyUpsertArgs} args - Arguments to update or create a UserVocabulary.
     * @example
     * // Update or create a UserVocabulary
     * const userVocabulary = await prisma.userVocabulary.upsert({
     *   create: {
     *     // ... data to create a UserVocabulary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserVocabulary we want to update
     *   }
     * })
     */
    upsert<T extends UserVocabularyUpsertArgs>(args: SelectSubset<T, UserVocabularyUpsertArgs<ExtArgs>>): Prisma__UserVocabularyClient<$Result.GetResult<Prisma.$UserVocabularyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserVocabularies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyCountArgs} args - Arguments to filter UserVocabularies to count.
     * @example
     * // Count the number of UserVocabularies
     * const count = await prisma.userVocabulary.count({
     *   where: {
     *     // ... the filter for the UserVocabularies we want to count
     *   }
     * })
    **/
    count<T extends UserVocabularyCountArgs>(
      args?: Subset<T, UserVocabularyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserVocabularyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserVocabulary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserVocabularyAggregateArgs>(args: Subset<T, UserVocabularyAggregateArgs>): Prisma.PrismaPromise<GetUserVocabularyAggregateType<T>>

    /**
     * Group by UserVocabulary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserVocabularyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserVocabularyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserVocabularyGroupByArgs['orderBy'] }
        : { orderBy?: UserVocabularyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserVocabularyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserVocabularyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserVocabulary model
   */
  readonly fields: UserVocabularyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserVocabulary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserVocabularyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    vocabulary<T extends VocabularyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VocabularyDefaultArgs<ExtArgs>>): Prisma__VocabularyClient<$Result.GetResult<Prisma.$VocabularyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserVocabulary model
   */
  interface UserVocabularyFieldRefs {
    readonly id: FieldRef<"UserVocabulary", 'Int'>
    readonly userId: FieldRef<"UserVocabulary", 'Int'>
    readonly vocabularyId: FieldRef<"UserVocabulary", 'Int'>
    readonly learned: FieldRef<"UserVocabulary", 'Boolean'>
    readonly lastPracticed: FieldRef<"UserVocabulary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserVocabulary findUnique
   */
  export type UserVocabularyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * Filter, which UserVocabulary to fetch.
     */
    where: UserVocabularyWhereUniqueInput
  }

  /**
   * UserVocabulary findUniqueOrThrow
   */
  export type UserVocabularyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * Filter, which UserVocabulary to fetch.
     */
    where: UserVocabularyWhereUniqueInput
  }

  /**
   * UserVocabulary findFirst
   */
  export type UserVocabularyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * Filter, which UserVocabulary to fetch.
     */
    where?: UserVocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserVocabularies to fetch.
     */
    orderBy?: UserVocabularyOrderByWithRelationInput | UserVocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserVocabularies.
     */
    cursor?: UserVocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserVocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserVocabularies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserVocabularies.
     */
    distinct?: UserVocabularyScalarFieldEnum | UserVocabularyScalarFieldEnum[]
  }

  /**
   * UserVocabulary findFirstOrThrow
   */
  export type UserVocabularyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * Filter, which UserVocabulary to fetch.
     */
    where?: UserVocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserVocabularies to fetch.
     */
    orderBy?: UserVocabularyOrderByWithRelationInput | UserVocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserVocabularies.
     */
    cursor?: UserVocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserVocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserVocabularies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserVocabularies.
     */
    distinct?: UserVocabularyScalarFieldEnum | UserVocabularyScalarFieldEnum[]
  }

  /**
   * UserVocabulary findMany
   */
  export type UserVocabularyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * Filter, which UserVocabularies to fetch.
     */
    where?: UserVocabularyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserVocabularies to fetch.
     */
    orderBy?: UserVocabularyOrderByWithRelationInput | UserVocabularyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserVocabularies.
     */
    cursor?: UserVocabularyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserVocabularies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserVocabularies.
     */
    skip?: number
    distinct?: UserVocabularyScalarFieldEnum | UserVocabularyScalarFieldEnum[]
  }

  /**
   * UserVocabulary create
   */
  export type UserVocabularyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * The data needed to create a UserVocabulary.
     */
    data: XOR<UserVocabularyCreateInput, UserVocabularyUncheckedCreateInput>
  }

  /**
   * UserVocabulary createMany
   */
  export type UserVocabularyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserVocabularies.
     */
    data: UserVocabularyCreateManyInput | UserVocabularyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserVocabulary createManyAndReturn
   */
  export type UserVocabularyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * The data used to create many UserVocabularies.
     */
    data: UserVocabularyCreateManyInput | UserVocabularyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserVocabulary update
   */
  export type UserVocabularyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * The data needed to update a UserVocabulary.
     */
    data: XOR<UserVocabularyUpdateInput, UserVocabularyUncheckedUpdateInput>
    /**
     * Choose, which UserVocabulary to update.
     */
    where: UserVocabularyWhereUniqueInput
  }

  /**
   * UserVocabulary updateMany
   */
  export type UserVocabularyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserVocabularies.
     */
    data: XOR<UserVocabularyUpdateManyMutationInput, UserVocabularyUncheckedUpdateManyInput>
    /**
     * Filter which UserVocabularies to update
     */
    where?: UserVocabularyWhereInput
    /**
     * Limit how many UserVocabularies to update.
     */
    limit?: number
  }

  /**
   * UserVocabulary updateManyAndReturn
   */
  export type UserVocabularyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * The data used to update UserVocabularies.
     */
    data: XOR<UserVocabularyUpdateManyMutationInput, UserVocabularyUncheckedUpdateManyInput>
    /**
     * Filter which UserVocabularies to update
     */
    where?: UserVocabularyWhereInput
    /**
     * Limit how many UserVocabularies to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserVocabulary upsert
   */
  export type UserVocabularyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * The filter to search for the UserVocabulary to update in case it exists.
     */
    where: UserVocabularyWhereUniqueInput
    /**
     * In case the UserVocabulary found by the `where` argument doesn't exist, create a new UserVocabulary with this data.
     */
    create: XOR<UserVocabularyCreateInput, UserVocabularyUncheckedCreateInput>
    /**
     * In case the UserVocabulary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserVocabularyUpdateInput, UserVocabularyUncheckedUpdateInput>
  }

  /**
   * UserVocabulary delete
   */
  export type UserVocabularyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
    /**
     * Filter which UserVocabulary to delete.
     */
    where: UserVocabularyWhereUniqueInput
  }

  /**
   * UserVocabulary deleteMany
   */
  export type UserVocabularyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserVocabularies to delete
     */
    where?: UserVocabularyWhereInput
    /**
     * Limit how many UserVocabularies to delete.
     */
    limit?: number
  }

  /**
   * UserVocabulary without action
   */
  export type UserVocabularyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserVocabulary
     */
    select?: UserVocabularySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserVocabulary
     */
    omit?: UserVocabularyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserVocabularyInclude<ExtArgs> | null
  }


  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _avg: ConversationAvgAggregateOutputType | null
    _sum: ConversationSumAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationAvgAggregateOutputType = {
    userId: number | null
  }

  export type ConversationSumAggregateOutputType = {
    userId: number | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    userId: number | null
    title: string | null
    context: string | null
    startedAt: Date | null
    lastMessageAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    title: string | null
    context: string | null
    startedAt: Date | null
    lastMessageAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    context: number
    startedAt: number
    lastMessageAt: number
    _all: number
  }


  export type ConversationAvgAggregateInputType = {
    userId?: true
  }

  export type ConversationSumAggregateInputType = {
    userId?: true
  }

  export type ConversationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    context?: true
    startedAt?: true
    lastMessageAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    context?: true
    startedAt?: true
    lastMessageAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    context?: true
    startedAt?: true
    lastMessageAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConversationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConversationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _avg?: ConversationAvgAggregateInputType
    _sum?: ConversationSumAggregateInputType
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    userId: number
    title: string
    context: string
    startedAt: Date
    lastMessageAt: Date
    _count: ConversationCountAggregateOutputType | null
    _avg: ConversationAvgAggregateOutputType | null
    _sum: ConversationSumAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    context?: boolean
    startedAt?: boolean
    lastMessageAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    context?: boolean
    startedAt?: boolean
    lastMessageAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    context?: boolean
    startedAt?: boolean
    lastMessageAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    context?: boolean
    startedAt?: boolean
    lastMessageAt?: boolean
  }

  export type ConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "context" | "startedAt" | "lastMessageAt", ExtArgs["result"]["conversation"]>
  export type ConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      title: string
      context: string
      startedAt: Date
      lastMessageAt: Date
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conversations and returns the data saved in the database.
     * @param {ConversationCreateManyAndReturnArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations and returns the data updated in the database.
     * @param {ConversationUpdateManyAndReturnArgs} args - Arguments to update many Conversations.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends Conversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Conversation model
   */
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly userId: FieldRef<"Conversation", 'Int'>
    readonly title: FieldRef<"Conversation", 'String'>
    readonly context: FieldRef<"Conversation", 'String'>
    readonly startedAt: FieldRef<"Conversation", 'DateTime'>
    readonly lastMessageAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation createManyAndReturn
   */
  export type ConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation updateManyAndReturn
   */
  export type ConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to delete.
     */
    limit?: number
  }

  /**
   * Conversation.messages
   */
  export type Conversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageAvgAggregateOutputType = {
    id: number | null
  }

  export type MessageSumAggregateOutputType = {
    id: number | null
  }

  export type MessageMinAggregateOutputType = {
    id: number | null
    conversationId: string | null
    role: string | null
    content: string | null
    timestamp: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: number | null
    conversationId: string | null
    role: string | null
    content: string | null
    timestamp: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    content: number
    timestamp: number
    _all: number
  }


  export type MessageAvgAggregateInputType = {
    id?: true
  }

  export type MessageSumAggregateInputType = {
    id?: true
  }

  export type MessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    timestamp?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    timestamp?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    timestamp?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _avg?: MessageAvgAggregateInputType
    _sum?: MessageSumAggregateInputType
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: number
    conversationId: string
    role: string
    content: string
    timestamp: Date
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    timestamp?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    timestamp?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    timestamp?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    timestamp?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "role" | "content" | "timestamp", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      conversation: Prisma.$ConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      conversationId: string
      role: string
      content: string
      timestamp: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationDefaultArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'Int'>
    readonly conversationId: FieldRef<"Message", 'String'>
    readonly role: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly timestamp: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model ExamResult
   */

  export type AggregateExamResult = {
    _count: ExamResultCountAggregateOutputType | null
    _avg: ExamResultAvgAggregateOutputType | null
    _sum: ExamResultSumAggregateOutputType | null
    _min: ExamResultMinAggregateOutputType | null
    _max: ExamResultMaxAggregateOutputType | null
  }

  export type ExamResultAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    score: number | null
  }

  export type ExamResultSumAggregateOutputType = {
    id: number | null
    userId: number | null
    score: number | null
  }

  export type ExamResultMinAggregateOutputType = {
    id: number | null
    userId: number | null
    examId: string | null
    section: string | null
    level: string | null
    score: number | null
    completedAt: Date | null
  }

  export type ExamResultMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    examId: string | null
    section: string | null
    level: string | null
    score: number | null
    completedAt: Date | null
  }

  export type ExamResultCountAggregateOutputType = {
    id: number
    userId: number
    examId: number
    section: number
    level: number
    score: number
    details: number
    completedAt: number
    _all: number
  }


  export type ExamResultAvgAggregateInputType = {
    id?: true
    userId?: true
    score?: true
  }

  export type ExamResultSumAggregateInputType = {
    id?: true
    userId?: true
    score?: true
  }

  export type ExamResultMinAggregateInputType = {
    id?: true
    userId?: true
    examId?: true
    section?: true
    level?: true
    score?: true
    completedAt?: true
  }

  export type ExamResultMaxAggregateInputType = {
    id?: true
    userId?: true
    examId?: true
    section?: true
    level?: true
    score?: true
    completedAt?: true
  }

  export type ExamResultCountAggregateInputType = {
    id?: true
    userId?: true
    examId?: true
    section?: true
    level?: true
    score?: true
    details?: true
    completedAt?: true
    _all?: true
  }

  export type ExamResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamResult to aggregate.
     */
    where?: ExamResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamResults to fetch.
     */
    orderBy?: ExamResultOrderByWithRelationInput | ExamResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamResults
    **/
    _count?: true | ExamResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamResultMaxAggregateInputType
  }

  export type GetExamResultAggregateType<T extends ExamResultAggregateArgs> = {
        [P in keyof T & keyof AggregateExamResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamResult[P]>
      : GetScalarType<T[P], AggregateExamResult[P]>
  }




  export type ExamResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamResultWhereInput
    orderBy?: ExamResultOrderByWithAggregationInput | ExamResultOrderByWithAggregationInput[]
    by: ExamResultScalarFieldEnum[] | ExamResultScalarFieldEnum
    having?: ExamResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamResultCountAggregateInputType | true
    _avg?: ExamResultAvgAggregateInputType
    _sum?: ExamResultSumAggregateInputType
    _min?: ExamResultMinAggregateInputType
    _max?: ExamResultMaxAggregateInputType
  }

  export type ExamResultGroupByOutputType = {
    id: number
    userId: number
    examId: string
    section: string
    level: string
    score: number
    details: JsonValue
    completedAt: Date
    _count: ExamResultCountAggregateOutputType | null
    _avg: ExamResultAvgAggregateOutputType | null
    _sum: ExamResultSumAggregateOutputType | null
    _min: ExamResultMinAggregateOutputType | null
    _max: ExamResultMaxAggregateOutputType | null
  }

  type GetExamResultGroupByPayload<T extends ExamResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamResultGroupByOutputType[P]>
            : GetScalarType<T[P], ExamResultGroupByOutputType[P]>
        }
      >
    >


  export type ExamResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    examId?: boolean
    section?: boolean
    level?: boolean
    score?: boolean
    details?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examResult"]>

  export type ExamResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    examId?: boolean
    section?: boolean
    level?: boolean
    score?: boolean
    details?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examResult"]>

  export type ExamResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    examId?: boolean
    section?: boolean
    level?: boolean
    score?: boolean
    details?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examResult"]>

  export type ExamResultSelectScalar = {
    id?: boolean
    userId?: boolean
    examId?: boolean
    section?: boolean
    level?: boolean
    score?: boolean
    details?: boolean
    completedAt?: boolean
  }

  export type ExamResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "examId" | "section" | "level" | "score" | "details" | "completedAt", ExtArgs["result"]["examResult"]>
  export type ExamResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExamResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExamResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExamResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamResult"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      examId: string
      section: string
      level: string
      score: number
      details: Prisma.JsonValue
      completedAt: Date
    }, ExtArgs["result"]["examResult"]>
    composites: {}
  }

  type ExamResultGetPayload<S extends boolean | null | undefined | ExamResultDefaultArgs> = $Result.GetResult<Prisma.$ExamResultPayload, S>

  type ExamResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamResultCountAggregateInputType | true
    }

  export interface ExamResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamResult'], meta: { name: 'ExamResult' } }
    /**
     * Find zero or one ExamResult that matches the filter.
     * @param {ExamResultFindUniqueArgs} args - Arguments to find a ExamResult
     * @example
     * // Get one ExamResult
     * const examResult = await prisma.examResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamResultFindUniqueArgs>(args: SelectSubset<T, ExamResultFindUniqueArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExamResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamResultFindUniqueOrThrowArgs} args - Arguments to find a ExamResult
     * @example
     * // Get one ExamResult
     * const examResult = await prisma.examResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamResultFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultFindFirstArgs} args - Arguments to find a ExamResult
     * @example
     * // Get one ExamResult
     * const examResult = await prisma.examResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamResultFindFirstArgs>(args?: SelectSubset<T, ExamResultFindFirstArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultFindFirstOrThrowArgs} args - Arguments to find a ExamResult
     * @example
     * // Get one ExamResult
     * const examResult = await prisma.examResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamResultFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExamResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamResults
     * const examResults = await prisma.examResult.findMany()
     * 
     * // Get first 10 ExamResults
     * const examResults = await prisma.examResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examResultWithIdOnly = await prisma.examResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamResultFindManyArgs>(args?: SelectSubset<T, ExamResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExamResult.
     * @param {ExamResultCreateArgs} args - Arguments to create a ExamResult.
     * @example
     * // Create one ExamResult
     * const ExamResult = await prisma.examResult.create({
     *   data: {
     *     // ... data to create a ExamResult
     *   }
     * })
     * 
     */
    create<T extends ExamResultCreateArgs>(args: SelectSubset<T, ExamResultCreateArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExamResults.
     * @param {ExamResultCreateManyArgs} args - Arguments to create many ExamResults.
     * @example
     * // Create many ExamResults
     * const examResult = await prisma.examResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamResultCreateManyArgs>(args?: SelectSubset<T, ExamResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamResults and returns the data saved in the database.
     * @param {ExamResultCreateManyAndReturnArgs} args - Arguments to create many ExamResults.
     * @example
     * // Create many ExamResults
     * const examResult = await prisma.examResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamResults and only return the `id`
     * const examResultWithIdOnly = await prisma.examResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamResultCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExamResult.
     * @param {ExamResultDeleteArgs} args - Arguments to delete one ExamResult.
     * @example
     * // Delete one ExamResult
     * const ExamResult = await prisma.examResult.delete({
     *   where: {
     *     // ... filter to delete one ExamResult
     *   }
     * })
     * 
     */
    delete<T extends ExamResultDeleteArgs>(args: SelectSubset<T, ExamResultDeleteArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExamResult.
     * @param {ExamResultUpdateArgs} args - Arguments to update one ExamResult.
     * @example
     * // Update one ExamResult
     * const examResult = await prisma.examResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamResultUpdateArgs>(args: SelectSubset<T, ExamResultUpdateArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExamResults.
     * @param {ExamResultDeleteManyArgs} args - Arguments to filter ExamResults to delete.
     * @example
     * // Delete a few ExamResults
     * const { count } = await prisma.examResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamResultDeleteManyArgs>(args?: SelectSubset<T, ExamResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamResults
     * const examResult = await prisma.examResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamResultUpdateManyArgs>(args: SelectSubset<T, ExamResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamResults and returns the data updated in the database.
     * @param {ExamResultUpdateManyAndReturnArgs} args - Arguments to update many ExamResults.
     * @example
     * // Update many ExamResults
     * const examResult = await prisma.examResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExamResults and only return the `id`
     * const examResultWithIdOnly = await prisma.examResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExamResultUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExamResult.
     * @param {ExamResultUpsertArgs} args - Arguments to update or create a ExamResult.
     * @example
     * // Update or create a ExamResult
     * const examResult = await prisma.examResult.upsert({
     *   create: {
     *     // ... data to create a ExamResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamResult we want to update
     *   }
     * })
     */
    upsert<T extends ExamResultUpsertArgs>(args: SelectSubset<T, ExamResultUpsertArgs<ExtArgs>>): Prisma__ExamResultClient<$Result.GetResult<Prisma.$ExamResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExamResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultCountArgs} args - Arguments to filter ExamResults to count.
     * @example
     * // Count the number of ExamResults
     * const count = await prisma.examResult.count({
     *   where: {
     *     // ... the filter for the ExamResults we want to count
     *   }
     * })
    **/
    count<T extends ExamResultCountArgs>(
      args?: Subset<T, ExamResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExamResultAggregateArgs>(args: Subset<T, ExamResultAggregateArgs>): Prisma.PrismaPromise<GetExamResultAggregateType<T>>

    /**
     * Group by ExamResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExamResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamResultGroupByArgs['orderBy'] }
        : { orderBy?: ExamResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExamResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamResult model
   */
  readonly fields: ExamResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExamResult model
   */
  interface ExamResultFieldRefs {
    readonly id: FieldRef<"ExamResult", 'Int'>
    readonly userId: FieldRef<"ExamResult", 'Int'>
    readonly examId: FieldRef<"ExamResult", 'String'>
    readonly section: FieldRef<"ExamResult", 'String'>
    readonly level: FieldRef<"ExamResult", 'String'>
    readonly score: FieldRef<"ExamResult", 'Int'>
    readonly details: FieldRef<"ExamResult", 'Json'>
    readonly completedAt: FieldRef<"ExamResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExamResult findUnique
   */
  export type ExamResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * Filter, which ExamResult to fetch.
     */
    where: ExamResultWhereUniqueInput
  }

  /**
   * ExamResult findUniqueOrThrow
   */
  export type ExamResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * Filter, which ExamResult to fetch.
     */
    where: ExamResultWhereUniqueInput
  }

  /**
   * ExamResult findFirst
   */
  export type ExamResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * Filter, which ExamResult to fetch.
     */
    where?: ExamResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamResults to fetch.
     */
    orderBy?: ExamResultOrderByWithRelationInput | ExamResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamResults.
     */
    cursor?: ExamResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamResults.
     */
    distinct?: ExamResultScalarFieldEnum | ExamResultScalarFieldEnum[]
  }

  /**
   * ExamResult findFirstOrThrow
   */
  export type ExamResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * Filter, which ExamResult to fetch.
     */
    where?: ExamResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamResults to fetch.
     */
    orderBy?: ExamResultOrderByWithRelationInput | ExamResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamResults.
     */
    cursor?: ExamResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamResults.
     */
    distinct?: ExamResultScalarFieldEnum | ExamResultScalarFieldEnum[]
  }

  /**
   * ExamResult findMany
   */
  export type ExamResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * Filter, which ExamResults to fetch.
     */
    where?: ExamResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamResults to fetch.
     */
    orderBy?: ExamResultOrderByWithRelationInput | ExamResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamResults.
     */
    cursor?: ExamResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamResults.
     */
    skip?: number
    distinct?: ExamResultScalarFieldEnum | ExamResultScalarFieldEnum[]
  }

  /**
   * ExamResult create
   */
  export type ExamResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamResult.
     */
    data: XOR<ExamResultCreateInput, ExamResultUncheckedCreateInput>
  }

  /**
   * ExamResult createMany
   */
  export type ExamResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamResults.
     */
    data: ExamResultCreateManyInput | ExamResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamResult createManyAndReturn
   */
  export type ExamResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * The data used to create many ExamResults.
     */
    data: ExamResultCreateManyInput | ExamResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamResult update
   */
  export type ExamResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamResult.
     */
    data: XOR<ExamResultUpdateInput, ExamResultUncheckedUpdateInput>
    /**
     * Choose, which ExamResult to update.
     */
    where: ExamResultWhereUniqueInput
  }

  /**
   * ExamResult updateMany
   */
  export type ExamResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamResults.
     */
    data: XOR<ExamResultUpdateManyMutationInput, ExamResultUncheckedUpdateManyInput>
    /**
     * Filter which ExamResults to update
     */
    where?: ExamResultWhereInput
    /**
     * Limit how many ExamResults to update.
     */
    limit?: number
  }

  /**
   * ExamResult updateManyAndReturn
   */
  export type ExamResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * The data used to update ExamResults.
     */
    data: XOR<ExamResultUpdateManyMutationInput, ExamResultUncheckedUpdateManyInput>
    /**
     * Filter which ExamResults to update
     */
    where?: ExamResultWhereInput
    /**
     * Limit how many ExamResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamResult upsert
   */
  export type ExamResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamResult to update in case it exists.
     */
    where: ExamResultWhereUniqueInput
    /**
     * In case the ExamResult found by the `where` argument doesn't exist, create a new ExamResult with this data.
     */
    create: XOR<ExamResultCreateInput, ExamResultUncheckedCreateInput>
    /**
     * In case the ExamResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamResultUpdateInput, ExamResultUncheckedUpdateInput>
  }

  /**
   * ExamResult delete
   */
  export type ExamResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
    /**
     * Filter which ExamResult to delete.
     */
    where: ExamResultWhereUniqueInput
  }

  /**
   * ExamResult deleteMany
   */
  export type ExamResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamResults to delete
     */
    where?: ExamResultWhereInput
    /**
     * Limit how many ExamResults to delete.
     */
    limit?: number
  }

  /**
   * ExamResult without action
   */
  export type ExamResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamResult
     */
    select?: ExamResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamResult
     */
    omit?: ExamResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamResultInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    level: 'level',
    points: 'points',
    streakDays: 'streakDays',
    joinedAt: 'joinedAt',
    learningGoals: 'learningGoals',
    completedLessons: 'completedLessons',
    lastActive: 'lastActive',
    dailyGoal: 'dailyGoal',
    notifications: 'notifications',
    theme: 'theme'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LessonScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    level: 'level',
    duration: 'duration',
    topics: 'topics',
    content: 'content'
  };

  export type LessonScalarFieldEnum = (typeof LessonScalarFieldEnum)[keyof typeof LessonScalarFieldEnum]


  export const LessonProgressScalarFieldEnum: {
    id: 'id',
    lessonId: 'lessonId',
    userId: 'userId',
    completed: 'completed',
    score: 'score',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    answers: 'answers'
  };

  export type LessonProgressScalarFieldEnum = (typeof LessonProgressScalarFieldEnum)[keyof typeof LessonProgressScalarFieldEnum]


  export const VocabularyScalarFieldEnum: {
    id: 'id',
    word: 'word',
    translation: 'translation',
    example: 'example',
    level: 'level'
  };

  export type VocabularyScalarFieldEnum = (typeof VocabularyScalarFieldEnum)[keyof typeof VocabularyScalarFieldEnum]


  export const UserVocabularyScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    vocabularyId: 'vocabularyId',
    learned: 'learned',
    lastPracticed: 'lastPracticed'
  };

  export type UserVocabularyScalarFieldEnum = (typeof UserVocabularyScalarFieldEnum)[keyof typeof UserVocabularyScalarFieldEnum]


  export const ConversationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    context: 'context',
    startedAt: 'startedAt',
    lastMessageAt: 'lastMessageAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    timestamp: 'timestamp'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const ExamResultScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    examId: 'examId',
    section: 'section',
    level: 'level',
    score: 'score',
    details: 'details',
    completedAt: 'completedAt'
  };

  export type ExamResultScalarFieldEnum = (typeof ExamResultScalarFieldEnum)[keyof typeof ExamResultScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    level?: StringFilter<"User"> | string
    points?: IntFilter<"User"> | number
    streakDays?: IntFilter<"User"> | number
    joinedAt?: DateTimeFilter<"User"> | Date | string
    learningGoals?: StringNullableListFilter<"User">
    completedLessons?: IntFilter<"User"> | number
    lastActive?: DateTimeFilter<"User"> | Date | string
    dailyGoal?: IntFilter<"User"> | number
    notifications?: BoolFilter<"User"> | boolean
    theme?: StringFilter<"User"> | string
    lessonProgress?: LessonProgressListRelationFilter
    vocabulary?: UserVocabularyListRelationFilter
    examResults?: ExamResultListRelationFilter
    conversations?: ConversationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrderInput | SortOrder
    level?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    joinedAt?: SortOrder
    learningGoals?: SortOrder
    completedLessons?: SortOrder
    lastActive?: SortOrder
    dailyGoal?: SortOrder
    notifications?: SortOrder
    theme?: SortOrder
    lessonProgress?: LessonProgressOrderByRelationAggregateInput
    vocabulary?: UserVocabularyOrderByRelationAggregateInput
    examResults?: ExamResultOrderByRelationAggregateInput
    conversations?: ConversationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    level?: StringFilter<"User"> | string
    points?: IntFilter<"User"> | number
    streakDays?: IntFilter<"User"> | number
    joinedAt?: DateTimeFilter<"User"> | Date | string
    learningGoals?: StringNullableListFilter<"User">
    completedLessons?: IntFilter<"User"> | number
    lastActive?: DateTimeFilter<"User"> | Date | string
    dailyGoal?: IntFilter<"User"> | number
    notifications?: BoolFilter<"User"> | boolean
    theme?: StringFilter<"User"> | string
    lessonProgress?: LessonProgressListRelationFilter
    vocabulary?: UserVocabularyListRelationFilter
    examResults?: ExamResultListRelationFilter
    conversations?: ConversationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrderInput | SortOrder
    level?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    joinedAt?: SortOrder
    learningGoals?: SortOrder
    completedLessons?: SortOrder
    lastActive?: SortOrder
    dailyGoal?: SortOrder
    notifications?: SortOrder
    theme?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    level?: StringWithAggregatesFilter<"User"> | string
    points?: IntWithAggregatesFilter<"User"> | number
    streakDays?: IntWithAggregatesFilter<"User"> | number
    joinedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    learningGoals?: StringNullableListFilter<"User">
    completedLessons?: IntWithAggregatesFilter<"User"> | number
    lastActive?: DateTimeWithAggregatesFilter<"User"> | Date | string
    dailyGoal?: IntWithAggregatesFilter<"User"> | number
    notifications?: BoolWithAggregatesFilter<"User"> | boolean
    theme?: StringWithAggregatesFilter<"User"> | string
  }

  export type LessonWhereInput = {
    AND?: LessonWhereInput | LessonWhereInput[]
    OR?: LessonWhereInput[]
    NOT?: LessonWhereInput | LessonWhereInput[]
    id?: IntFilter<"Lesson"> | number
    title?: StringFilter<"Lesson"> | string
    description?: StringFilter<"Lesson"> | string
    level?: StringFilter<"Lesson"> | string
    duration?: IntFilter<"Lesson"> | number
    topics?: StringNullableListFilter<"Lesson">
    content?: JsonFilter<"Lesson">
    progress?: LessonProgressListRelationFilter
  }

  export type LessonOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    level?: SortOrder
    duration?: SortOrder
    topics?: SortOrder
    content?: SortOrder
    progress?: LessonProgressOrderByRelationAggregateInput
  }

  export type LessonWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LessonWhereInput | LessonWhereInput[]
    OR?: LessonWhereInput[]
    NOT?: LessonWhereInput | LessonWhereInput[]
    title?: StringFilter<"Lesson"> | string
    description?: StringFilter<"Lesson"> | string
    level?: StringFilter<"Lesson"> | string
    duration?: IntFilter<"Lesson"> | number
    topics?: StringNullableListFilter<"Lesson">
    content?: JsonFilter<"Lesson">
    progress?: LessonProgressListRelationFilter
  }, "id">

  export type LessonOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    level?: SortOrder
    duration?: SortOrder
    topics?: SortOrder
    content?: SortOrder
    _count?: LessonCountOrderByAggregateInput
    _avg?: LessonAvgOrderByAggregateInput
    _max?: LessonMaxOrderByAggregateInput
    _min?: LessonMinOrderByAggregateInput
    _sum?: LessonSumOrderByAggregateInput
  }

  export type LessonScalarWhereWithAggregatesInput = {
    AND?: LessonScalarWhereWithAggregatesInput | LessonScalarWhereWithAggregatesInput[]
    OR?: LessonScalarWhereWithAggregatesInput[]
    NOT?: LessonScalarWhereWithAggregatesInput | LessonScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Lesson"> | number
    title?: StringWithAggregatesFilter<"Lesson"> | string
    description?: StringWithAggregatesFilter<"Lesson"> | string
    level?: StringWithAggregatesFilter<"Lesson"> | string
    duration?: IntWithAggregatesFilter<"Lesson"> | number
    topics?: StringNullableListFilter<"Lesson">
    content?: JsonWithAggregatesFilter<"Lesson">
  }

  export type LessonProgressWhereInput = {
    AND?: LessonProgressWhereInput | LessonProgressWhereInput[]
    OR?: LessonProgressWhereInput[]
    NOT?: LessonProgressWhereInput | LessonProgressWhereInput[]
    id?: IntFilter<"LessonProgress"> | number
    lessonId?: IntFilter<"LessonProgress"> | number
    userId?: IntFilter<"LessonProgress"> | number
    completed?: BoolFilter<"LessonProgress"> | boolean
    score?: IntFilter<"LessonProgress"> | number
    startedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    answers?: JsonNullableFilter<"LessonProgress">
    lesson?: XOR<LessonScalarRelationFilter, LessonWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LessonProgressOrderByWithRelationInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    answers?: SortOrderInput | SortOrder
    lesson?: LessonOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type LessonProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_lessonId?: LessonProgressUserIdLessonIdCompoundUniqueInput
    AND?: LessonProgressWhereInput | LessonProgressWhereInput[]
    OR?: LessonProgressWhereInput[]
    NOT?: LessonProgressWhereInput | LessonProgressWhereInput[]
    lessonId?: IntFilter<"LessonProgress"> | number
    userId?: IntFilter<"LessonProgress"> | number
    completed?: BoolFilter<"LessonProgress"> | boolean
    score?: IntFilter<"LessonProgress"> | number
    startedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    answers?: JsonNullableFilter<"LessonProgress">
    lesson?: XOR<LessonScalarRelationFilter, LessonWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_lessonId">

  export type LessonProgressOrderByWithAggregationInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    answers?: SortOrderInput | SortOrder
    _count?: LessonProgressCountOrderByAggregateInput
    _avg?: LessonProgressAvgOrderByAggregateInput
    _max?: LessonProgressMaxOrderByAggregateInput
    _min?: LessonProgressMinOrderByAggregateInput
    _sum?: LessonProgressSumOrderByAggregateInput
  }

  export type LessonProgressScalarWhereWithAggregatesInput = {
    AND?: LessonProgressScalarWhereWithAggregatesInput | LessonProgressScalarWhereWithAggregatesInput[]
    OR?: LessonProgressScalarWhereWithAggregatesInput[]
    NOT?: LessonProgressScalarWhereWithAggregatesInput | LessonProgressScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LessonProgress"> | number
    lessonId?: IntWithAggregatesFilter<"LessonProgress"> | number
    userId?: IntWithAggregatesFilter<"LessonProgress"> | number
    completed?: BoolWithAggregatesFilter<"LessonProgress"> | boolean
    score?: IntWithAggregatesFilter<"LessonProgress"> | number
    startedAt?: DateTimeNullableWithAggregatesFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"LessonProgress"> | Date | string | null
    answers?: JsonNullableWithAggregatesFilter<"LessonProgress">
  }

  export type VocabularyWhereInput = {
    AND?: VocabularyWhereInput | VocabularyWhereInput[]
    OR?: VocabularyWhereInput[]
    NOT?: VocabularyWhereInput | VocabularyWhereInput[]
    id?: IntFilter<"Vocabulary"> | number
    word?: StringFilter<"Vocabulary"> | string
    translation?: StringFilter<"Vocabulary"> | string
    example?: StringFilter<"Vocabulary"> | string
    level?: StringFilter<"Vocabulary"> | string
    userVocabulary?: UserVocabularyListRelationFilter
  }

  export type VocabularyOrderByWithRelationInput = {
    id?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    example?: SortOrder
    level?: SortOrder
    userVocabulary?: UserVocabularyOrderByRelationAggregateInput
  }

  export type VocabularyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    word?: string
    AND?: VocabularyWhereInput | VocabularyWhereInput[]
    OR?: VocabularyWhereInput[]
    NOT?: VocabularyWhereInput | VocabularyWhereInput[]
    translation?: StringFilter<"Vocabulary"> | string
    example?: StringFilter<"Vocabulary"> | string
    level?: StringFilter<"Vocabulary"> | string
    userVocabulary?: UserVocabularyListRelationFilter
  }, "id" | "word">

  export type VocabularyOrderByWithAggregationInput = {
    id?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    example?: SortOrder
    level?: SortOrder
    _count?: VocabularyCountOrderByAggregateInput
    _avg?: VocabularyAvgOrderByAggregateInput
    _max?: VocabularyMaxOrderByAggregateInput
    _min?: VocabularyMinOrderByAggregateInput
    _sum?: VocabularySumOrderByAggregateInput
  }

  export type VocabularyScalarWhereWithAggregatesInput = {
    AND?: VocabularyScalarWhereWithAggregatesInput | VocabularyScalarWhereWithAggregatesInput[]
    OR?: VocabularyScalarWhereWithAggregatesInput[]
    NOT?: VocabularyScalarWhereWithAggregatesInput | VocabularyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Vocabulary"> | number
    word?: StringWithAggregatesFilter<"Vocabulary"> | string
    translation?: StringWithAggregatesFilter<"Vocabulary"> | string
    example?: StringWithAggregatesFilter<"Vocabulary"> | string
    level?: StringWithAggregatesFilter<"Vocabulary"> | string
  }

  export type UserVocabularyWhereInput = {
    AND?: UserVocabularyWhereInput | UserVocabularyWhereInput[]
    OR?: UserVocabularyWhereInput[]
    NOT?: UserVocabularyWhereInput | UserVocabularyWhereInput[]
    id?: IntFilter<"UserVocabulary"> | number
    userId?: IntFilter<"UserVocabulary"> | number
    vocabularyId?: IntFilter<"UserVocabulary"> | number
    learned?: BoolFilter<"UserVocabulary"> | boolean
    lastPracticed?: DateTimeNullableFilter<"UserVocabulary"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    vocabulary?: XOR<VocabularyScalarRelationFilter, VocabularyWhereInput>
  }

  export type UserVocabularyOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
    learned?: SortOrder
    lastPracticed?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    vocabulary?: VocabularyOrderByWithRelationInput
  }

  export type UserVocabularyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_vocabularyId?: UserVocabularyUserIdVocabularyIdCompoundUniqueInput
    AND?: UserVocabularyWhereInput | UserVocabularyWhereInput[]
    OR?: UserVocabularyWhereInput[]
    NOT?: UserVocabularyWhereInput | UserVocabularyWhereInput[]
    userId?: IntFilter<"UserVocabulary"> | number
    vocabularyId?: IntFilter<"UserVocabulary"> | number
    learned?: BoolFilter<"UserVocabulary"> | boolean
    lastPracticed?: DateTimeNullableFilter<"UserVocabulary"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    vocabulary?: XOR<VocabularyScalarRelationFilter, VocabularyWhereInput>
  }, "id" | "userId_vocabularyId">

  export type UserVocabularyOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
    learned?: SortOrder
    lastPracticed?: SortOrderInput | SortOrder
    _count?: UserVocabularyCountOrderByAggregateInput
    _avg?: UserVocabularyAvgOrderByAggregateInput
    _max?: UserVocabularyMaxOrderByAggregateInput
    _min?: UserVocabularyMinOrderByAggregateInput
    _sum?: UserVocabularySumOrderByAggregateInput
  }

  export type UserVocabularyScalarWhereWithAggregatesInput = {
    AND?: UserVocabularyScalarWhereWithAggregatesInput | UserVocabularyScalarWhereWithAggregatesInput[]
    OR?: UserVocabularyScalarWhereWithAggregatesInput[]
    NOT?: UserVocabularyScalarWhereWithAggregatesInput | UserVocabularyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserVocabulary"> | number
    userId?: IntWithAggregatesFilter<"UserVocabulary"> | number
    vocabularyId?: IntWithAggregatesFilter<"UserVocabulary"> | number
    learned?: BoolWithAggregatesFilter<"UserVocabulary"> | boolean
    lastPracticed?: DateTimeNullableWithAggregatesFilter<"UserVocabulary"> | Date | string | null
  }

  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    userId?: IntFilter<"Conversation"> | number
    title?: StringFilter<"Conversation"> | string
    context?: StringFilter<"Conversation"> | string
    startedAt?: DateTimeFilter<"Conversation"> | Date | string
    lastMessageAt?: DateTimeFilter<"Conversation"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: MessageListRelationFilter
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    lastMessageAt?: SortOrder
    user?: UserOrderByWithRelationInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    userId?: IntFilter<"Conversation"> | number
    title?: StringFilter<"Conversation"> | string
    context?: StringFilter<"Conversation"> | string
    startedAt?: DateTimeFilter<"Conversation"> | Date | string
    lastMessageAt?: DateTimeFilter<"Conversation"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: MessageListRelationFilter
  }, "id">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    lastMessageAt?: SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _avg?: ConversationAvgOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
    _sum?: ConversationSumOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    userId?: IntWithAggregatesFilter<"Conversation"> | number
    title?: StringWithAggregatesFilter<"Conversation"> | string
    context?: StringWithAggregatesFilter<"Conversation"> | string
    startedAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    lastMessageAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: IntFilter<"Message"> | number
    conversationId?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    timestamp?: DateTimeFilter<"Message"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    timestamp?: SortOrder
    conversation?: ConversationOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    conversationId?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    timestamp?: DateTimeFilter<"Message"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    timestamp?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _avg?: MessageAvgOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
    _sum?: MessageSumOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Message"> | number
    conversationId?: StringWithAggregatesFilter<"Message"> | string
    role?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type ExamResultWhereInput = {
    AND?: ExamResultWhereInput | ExamResultWhereInput[]
    OR?: ExamResultWhereInput[]
    NOT?: ExamResultWhereInput | ExamResultWhereInput[]
    id?: IntFilter<"ExamResult"> | number
    userId?: IntFilter<"ExamResult"> | number
    examId?: StringFilter<"ExamResult"> | string
    section?: StringFilter<"ExamResult"> | string
    level?: StringFilter<"ExamResult"> | string
    score?: IntFilter<"ExamResult"> | number
    details?: JsonFilter<"ExamResult">
    completedAt?: DateTimeFilter<"ExamResult"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ExamResultOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    examId?: SortOrder
    section?: SortOrder
    level?: SortOrder
    score?: SortOrder
    details?: SortOrder
    completedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ExamResultWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ExamResultWhereInput | ExamResultWhereInput[]
    OR?: ExamResultWhereInput[]
    NOT?: ExamResultWhereInput | ExamResultWhereInput[]
    userId?: IntFilter<"ExamResult"> | number
    examId?: StringFilter<"ExamResult"> | string
    section?: StringFilter<"ExamResult"> | string
    level?: StringFilter<"ExamResult"> | string
    score?: IntFilter<"ExamResult"> | number
    details?: JsonFilter<"ExamResult">
    completedAt?: DateTimeFilter<"ExamResult"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ExamResultOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    examId?: SortOrder
    section?: SortOrder
    level?: SortOrder
    score?: SortOrder
    details?: SortOrder
    completedAt?: SortOrder
    _count?: ExamResultCountOrderByAggregateInput
    _avg?: ExamResultAvgOrderByAggregateInput
    _max?: ExamResultMaxOrderByAggregateInput
    _min?: ExamResultMinOrderByAggregateInput
    _sum?: ExamResultSumOrderByAggregateInput
  }

  export type ExamResultScalarWhereWithAggregatesInput = {
    AND?: ExamResultScalarWhereWithAggregatesInput | ExamResultScalarWhereWithAggregatesInput[]
    OR?: ExamResultScalarWhereWithAggregatesInput[]
    NOT?: ExamResultScalarWhereWithAggregatesInput | ExamResultScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ExamResult"> | number
    userId?: IntWithAggregatesFilter<"ExamResult"> | number
    examId?: StringWithAggregatesFilter<"ExamResult"> | string
    section?: StringWithAggregatesFilter<"ExamResult"> | string
    level?: StringWithAggregatesFilter<"ExamResult"> | string
    score?: IntWithAggregatesFilter<"ExamResult"> | number
    details?: JsonWithAggregatesFilter<"ExamResult">
    completedAt?: DateTimeWithAggregatesFilter<"ExamResult"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressCreateNestedManyWithoutUserInput
    vocabulary?: UserVocabularyCreateNestedManyWithoutUserInput
    examResults?: ExamResultCreateNestedManyWithoutUserInput
    conversations?: ConversationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutUserInput
    vocabulary?: UserVocabularyUncheckedCreateNestedManyWithoutUserInput
    examResults?: ExamResultUncheckedCreateNestedManyWithoutUserInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUpdateManyWithoutUserNestedInput
    vocabulary?: UserVocabularyUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUpdateManyWithoutUserNestedInput
    conversations?: ConversationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutUserNestedInput
    vocabulary?: UserVocabularyUncheckedUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUncheckedUpdateManyWithoutUserNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
  }

  export type LessonCreateInput = {
    title: string
    description: string
    level: string
    duration: number
    topics?: LessonCreatetopicsInput | string[]
    content: JsonNullValueInput | InputJsonValue
    progress?: LessonProgressCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateInput = {
    id?: number
    title: string
    description: string
    level: string
    duration: number
    topics?: LessonCreatetopicsInput | string[]
    content: JsonNullValueInput | InputJsonValue
    progress?: LessonProgressUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    topics?: LessonUpdatetopicsInput | string[]
    content?: JsonNullValueInput | InputJsonValue
    progress?: LessonProgressUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    topics?: LessonUpdatetopicsInput | string[]
    content?: JsonNullValueInput | InputJsonValue
    progress?: LessonProgressUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type LessonCreateManyInput = {
    id?: number
    title: string
    description: string
    level: string
    duration: number
    topics?: LessonCreatetopicsInput | string[]
    content: JsonNullValueInput | InputJsonValue
  }

  export type LessonUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    topics?: LessonUpdatetopicsInput | string[]
    content?: JsonNullValueInput | InputJsonValue
  }

  export type LessonUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    topics?: LessonUpdatetopicsInput | string[]
    content?: JsonNullValueInput | InputJsonValue
  }

  export type LessonProgressCreateInput = {
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
    lesson: LessonCreateNestedOneWithoutProgressInput
    user: UserCreateNestedOneWithoutLessonProgressInput
  }

  export type LessonProgressUncheckedCreateInput = {
    id?: number
    lessonId: number
    userId: number
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressUpdateInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
    lesson?: LessonUpdateOneRequiredWithoutProgressNestedInput
    user?: UserUpdateOneRequiredWithoutLessonProgressNestedInput
  }

  export type LessonProgressUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    lessonId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressCreateManyInput = {
    id?: number
    lessonId: number
    userId: number
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressUpdateManyMutationInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    lessonId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VocabularyCreateInput = {
    word: string
    translation: string
    example: string
    level: string
    userVocabulary?: UserVocabularyCreateNestedManyWithoutVocabularyInput
  }

  export type VocabularyUncheckedCreateInput = {
    id?: number
    word: string
    translation: string
    example: string
    level: string
    userVocabulary?: UserVocabularyUncheckedCreateNestedManyWithoutVocabularyInput
  }

  export type VocabularyUpdateInput = {
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    example?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    userVocabulary?: UserVocabularyUpdateManyWithoutVocabularyNestedInput
  }

  export type VocabularyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    example?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    userVocabulary?: UserVocabularyUncheckedUpdateManyWithoutVocabularyNestedInput
  }

  export type VocabularyCreateManyInput = {
    id?: number
    word: string
    translation: string
    example: string
    level: string
  }

  export type VocabularyUpdateManyMutationInput = {
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    example?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
  }

  export type VocabularyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    example?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
  }

  export type UserVocabularyCreateInput = {
    learned?: boolean
    lastPracticed?: Date | string | null
    user: UserCreateNestedOneWithoutVocabularyInput
    vocabulary: VocabularyCreateNestedOneWithoutUserVocabularyInput
  }

  export type UserVocabularyUncheckedCreateInput = {
    id?: number
    userId: number
    vocabularyId: number
    learned?: boolean
    lastPracticed?: Date | string | null
  }

  export type UserVocabularyUpdateInput = {
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutVocabularyNestedInput
    vocabulary?: VocabularyUpdateOneRequiredWithoutUserVocabularyNestedInput
  }

  export type UserVocabularyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    vocabularyId?: IntFieldUpdateOperationsInput | number
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserVocabularyCreateManyInput = {
    id?: number
    userId: number
    vocabularyId: number
    learned?: boolean
    lastPracticed?: Date | string | null
  }

  export type UserVocabularyUpdateManyMutationInput = {
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserVocabularyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    vocabularyId?: IntFieldUpdateOperationsInput | number
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConversationCreateInput = {
    id?: string
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
    user: UserCreateNestedOneWithoutConversationsInput
    messages?: MessageCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    userId: number
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutConversationsNestedInput
    messages?: MessageUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationCreateManyInput = {
    id?: string
    userId: number
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
  }

  export type ConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    role: string
    content: string
    timestamp?: Date | string
    conversation: ConversationCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: number
    conversationId: string
    role: string
    content: string
    timestamp?: Date | string
  }

  export type MessageUpdateInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: number
    conversationId: string
    role: string
    content: string
    timestamp?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamResultCreateInput = {
    examId: string
    section: string
    level: string
    score: number
    details: JsonNullValueInput | InputJsonValue
    completedAt: Date | string
    user: UserCreateNestedOneWithoutExamResultsInput
  }

  export type ExamResultUncheckedCreateInput = {
    id?: number
    userId: number
    examId: string
    section: string
    level: string
    score: number
    details: JsonNullValueInput | InputJsonValue
    completedAt: Date | string
  }

  export type ExamResultUpdateInput = {
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExamResultsNestedInput
  }

  export type ExamResultUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamResultCreateManyInput = {
    id?: number
    userId: number
    examId: string
    section: string
    level: string
    score: number
    details: JsonNullValueInput | InputJsonValue
    completedAt: Date | string
  }

  export type ExamResultUpdateManyMutationInput = {
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamResultUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type LessonProgressListRelationFilter = {
    every?: LessonProgressWhereInput
    some?: LessonProgressWhereInput
    none?: LessonProgressWhereInput
  }

  export type UserVocabularyListRelationFilter = {
    every?: UserVocabularyWhereInput
    some?: UserVocabularyWhereInput
    none?: UserVocabularyWhereInput
  }

  export type ExamResultListRelationFilter = {
    every?: ExamResultWhereInput
    some?: ExamResultWhereInput
    none?: ExamResultWhereInput
  }

  export type ConversationListRelationFilter = {
    every?: ConversationWhereInput
    some?: ConversationWhereInput
    none?: ConversationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LessonProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserVocabularyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    level?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    joinedAt?: SortOrder
    learningGoals?: SortOrder
    completedLessons?: SortOrder
    lastActive?: SortOrder
    dailyGoal?: SortOrder
    notifications?: SortOrder
    theme?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    completedLessons?: SortOrder
    dailyGoal?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    level?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    joinedAt?: SortOrder
    completedLessons?: SortOrder
    lastActive?: SortOrder
    dailyGoal?: SortOrder
    notifications?: SortOrder
    theme?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    level?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    joinedAt?: SortOrder
    completedLessons?: SortOrder
    lastActive?: SortOrder
    dailyGoal?: SortOrder
    notifications?: SortOrder
    theme?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    points?: SortOrder
    streakDays?: SortOrder
    completedLessons?: SortOrder
    dailyGoal?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LessonCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    level?: SortOrder
    duration?: SortOrder
    topics?: SortOrder
    content?: SortOrder
  }

  export type LessonAvgOrderByAggregateInput = {
    id?: SortOrder
    duration?: SortOrder
  }

  export type LessonMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    level?: SortOrder
    duration?: SortOrder
  }

  export type LessonMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    level?: SortOrder
    duration?: SortOrder
  }

  export type LessonSumOrderByAggregateInput = {
    id?: SortOrder
    duration?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LessonScalarRelationFilter = {
    is?: LessonWhereInput
    isNot?: LessonWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LessonProgressUserIdLessonIdCompoundUniqueInput = {
    userId: number
    lessonId: number
  }

  export type LessonProgressCountOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    answers?: SortOrder
  }

  export type LessonProgressAvgOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
  }

  export type LessonProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type LessonProgressMinOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type LessonProgressSumOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    score?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type VocabularyCountOrderByAggregateInput = {
    id?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    example?: SortOrder
    level?: SortOrder
  }

  export type VocabularyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type VocabularyMaxOrderByAggregateInput = {
    id?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    example?: SortOrder
    level?: SortOrder
  }

  export type VocabularyMinOrderByAggregateInput = {
    id?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    example?: SortOrder
    level?: SortOrder
  }

  export type VocabularySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type VocabularyScalarRelationFilter = {
    is?: VocabularyWhereInput
    isNot?: VocabularyWhereInput
  }

  export type UserVocabularyUserIdVocabularyIdCompoundUniqueInput = {
    userId: number
    vocabularyId: number
  }

  export type UserVocabularyCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
    learned?: SortOrder
    lastPracticed?: SortOrder
  }

  export type UserVocabularyAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
  }

  export type UserVocabularyMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
    learned?: SortOrder
    lastPracticed?: SortOrder
  }

  export type UserVocabularyMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
    learned?: SortOrder
    lastPracticed?: SortOrder
  }

  export type UserVocabularySumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    vocabularyId?: SortOrder
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    lastMessageAt?: SortOrder
  }

  export type ConversationAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    lastMessageAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    lastMessageAt?: SortOrder
  }

  export type ConversationSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ConversationScalarRelationFilter = {
    is?: ConversationWhereInput
    isNot?: ConversationWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    timestamp?: SortOrder
  }

  export type MessageAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    timestamp?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    timestamp?: SortOrder
  }

  export type MessageSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ExamResultCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    examId?: SortOrder
    section?: SortOrder
    level?: SortOrder
    score?: SortOrder
    details?: SortOrder
    completedAt?: SortOrder
  }

  export type ExamResultAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    score?: SortOrder
  }

  export type ExamResultMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    examId?: SortOrder
    section?: SortOrder
    level?: SortOrder
    score?: SortOrder
    completedAt?: SortOrder
  }

  export type ExamResultMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    examId?: SortOrder
    section?: SortOrder
    level?: SortOrder
    score?: SortOrder
    completedAt?: SortOrder
  }

  export type ExamResultSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    score?: SortOrder
  }

  export type UserCreatelearningGoalsInput = {
    set: string[]
  }

  export type LessonProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<LessonProgressCreateWithoutUserInput, LessonProgressUncheckedCreateWithoutUserInput> | LessonProgressCreateWithoutUserInput[] | LessonProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutUserInput | LessonProgressCreateOrConnectWithoutUserInput[]
    createMany?: LessonProgressCreateManyUserInputEnvelope
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
  }

  export type UserVocabularyCreateNestedManyWithoutUserInput = {
    create?: XOR<UserVocabularyCreateWithoutUserInput, UserVocabularyUncheckedCreateWithoutUserInput> | UserVocabularyCreateWithoutUserInput[] | UserVocabularyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutUserInput | UserVocabularyCreateOrConnectWithoutUserInput[]
    createMany?: UserVocabularyCreateManyUserInputEnvelope
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
  }

  export type ExamResultCreateNestedManyWithoutUserInput = {
    create?: XOR<ExamResultCreateWithoutUserInput, ExamResultUncheckedCreateWithoutUserInput> | ExamResultCreateWithoutUserInput[] | ExamResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamResultCreateOrConnectWithoutUserInput | ExamResultCreateOrConnectWithoutUserInput[]
    createMany?: ExamResultCreateManyUserInputEnvelope
    connect?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
  }

  export type ConversationCreateNestedManyWithoutUserInput = {
    create?: XOR<ConversationCreateWithoutUserInput, ConversationUncheckedCreateWithoutUserInput> | ConversationCreateWithoutUserInput[] | ConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutUserInput | ConversationCreateOrConnectWithoutUserInput[]
    createMany?: ConversationCreateManyUserInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type LessonProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LessonProgressCreateWithoutUserInput, LessonProgressUncheckedCreateWithoutUserInput> | LessonProgressCreateWithoutUserInput[] | LessonProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutUserInput | LessonProgressCreateOrConnectWithoutUserInput[]
    createMany?: LessonProgressCreateManyUserInputEnvelope
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
  }

  export type UserVocabularyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserVocabularyCreateWithoutUserInput, UserVocabularyUncheckedCreateWithoutUserInput> | UserVocabularyCreateWithoutUserInput[] | UserVocabularyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutUserInput | UserVocabularyCreateOrConnectWithoutUserInput[]
    createMany?: UserVocabularyCreateManyUserInputEnvelope
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
  }

  export type ExamResultUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExamResultCreateWithoutUserInput, ExamResultUncheckedCreateWithoutUserInput> | ExamResultCreateWithoutUserInput[] | ExamResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamResultCreateOrConnectWithoutUserInput | ExamResultCreateOrConnectWithoutUserInput[]
    createMany?: ExamResultCreateManyUserInputEnvelope
    connect?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
  }

  export type ConversationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ConversationCreateWithoutUserInput, ConversationUncheckedCreateWithoutUserInput> | ConversationCreateWithoutUserInput[] | ConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutUserInput | ConversationCreateOrConnectWithoutUserInput[]
    createMany?: ConversationCreateManyUserInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdatelearningGoalsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type LessonProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<LessonProgressCreateWithoutUserInput, LessonProgressUncheckedCreateWithoutUserInput> | LessonProgressCreateWithoutUserInput[] | LessonProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutUserInput | LessonProgressCreateOrConnectWithoutUserInput[]
    upsert?: LessonProgressUpsertWithWhereUniqueWithoutUserInput | LessonProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LessonProgressCreateManyUserInputEnvelope
    set?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    disconnect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    delete?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    update?: LessonProgressUpdateWithWhereUniqueWithoutUserInput | LessonProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LessonProgressUpdateManyWithWhereWithoutUserInput | LessonProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
  }

  export type UserVocabularyUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserVocabularyCreateWithoutUserInput, UserVocabularyUncheckedCreateWithoutUserInput> | UserVocabularyCreateWithoutUserInput[] | UserVocabularyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutUserInput | UserVocabularyCreateOrConnectWithoutUserInput[]
    upsert?: UserVocabularyUpsertWithWhereUniqueWithoutUserInput | UserVocabularyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserVocabularyCreateManyUserInputEnvelope
    set?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    disconnect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    delete?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    update?: UserVocabularyUpdateWithWhereUniqueWithoutUserInput | UserVocabularyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserVocabularyUpdateManyWithWhereWithoutUserInput | UserVocabularyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserVocabularyScalarWhereInput | UserVocabularyScalarWhereInput[]
  }

  export type ExamResultUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExamResultCreateWithoutUserInput, ExamResultUncheckedCreateWithoutUserInput> | ExamResultCreateWithoutUserInput[] | ExamResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamResultCreateOrConnectWithoutUserInput | ExamResultCreateOrConnectWithoutUserInput[]
    upsert?: ExamResultUpsertWithWhereUniqueWithoutUserInput | ExamResultUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExamResultCreateManyUserInputEnvelope
    set?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    disconnect?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    delete?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    connect?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    update?: ExamResultUpdateWithWhereUniqueWithoutUserInput | ExamResultUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExamResultUpdateManyWithWhereWithoutUserInput | ExamResultUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExamResultScalarWhereInput | ExamResultScalarWhereInput[]
  }

  export type ConversationUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConversationCreateWithoutUserInput, ConversationUncheckedCreateWithoutUserInput> | ConversationCreateWithoutUserInput[] | ConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutUserInput | ConversationCreateOrConnectWithoutUserInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutUserInput | ConversationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConversationCreateManyUserInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutUserInput | ConversationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutUserInput | ConversationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type LessonProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LessonProgressCreateWithoutUserInput, LessonProgressUncheckedCreateWithoutUserInput> | LessonProgressCreateWithoutUserInput[] | LessonProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutUserInput | LessonProgressCreateOrConnectWithoutUserInput[]
    upsert?: LessonProgressUpsertWithWhereUniqueWithoutUserInput | LessonProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LessonProgressCreateManyUserInputEnvelope
    set?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    disconnect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    delete?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    update?: LessonProgressUpdateWithWhereUniqueWithoutUserInput | LessonProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LessonProgressUpdateManyWithWhereWithoutUserInput | LessonProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
  }

  export type UserVocabularyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserVocabularyCreateWithoutUserInput, UserVocabularyUncheckedCreateWithoutUserInput> | UserVocabularyCreateWithoutUserInput[] | UserVocabularyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutUserInput | UserVocabularyCreateOrConnectWithoutUserInput[]
    upsert?: UserVocabularyUpsertWithWhereUniqueWithoutUserInput | UserVocabularyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserVocabularyCreateManyUserInputEnvelope
    set?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    disconnect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    delete?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    update?: UserVocabularyUpdateWithWhereUniqueWithoutUserInput | UserVocabularyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserVocabularyUpdateManyWithWhereWithoutUserInput | UserVocabularyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserVocabularyScalarWhereInput | UserVocabularyScalarWhereInput[]
  }

  export type ExamResultUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExamResultCreateWithoutUserInput, ExamResultUncheckedCreateWithoutUserInput> | ExamResultCreateWithoutUserInput[] | ExamResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamResultCreateOrConnectWithoutUserInput | ExamResultCreateOrConnectWithoutUserInput[]
    upsert?: ExamResultUpsertWithWhereUniqueWithoutUserInput | ExamResultUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExamResultCreateManyUserInputEnvelope
    set?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    disconnect?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    delete?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    connect?: ExamResultWhereUniqueInput | ExamResultWhereUniqueInput[]
    update?: ExamResultUpdateWithWhereUniqueWithoutUserInput | ExamResultUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExamResultUpdateManyWithWhereWithoutUserInput | ExamResultUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExamResultScalarWhereInput | ExamResultScalarWhereInput[]
  }

  export type ConversationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConversationCreateWithoutUserInput, ConversationUncheckedCreateWithoutUserInput> | ConversationCreateWithoutUserInput[] | ConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutUserInput | ConversationCreateOrConnectWithoutUserInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutUserInput | ConversationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConversationCreateManyUserInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutUserInput | ConversationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutUserInput | ConversationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type LessonCreatetopicsInput = {
    set: string[]
  }

  export type LessonProgressCreateNestedManyWithoutLessonInput = {
    create?: XOR<LessonProgressCreateWithoutLessonInput, LessonProgressUncheckedCreateWithoutLessonInput> | LessonProgressCreateWithoutLessonInput[] | LessonProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutLessonInput | LessonProgressCreateOrConnectWithoutLessonInput[]
    createMany?: LessonProgressCreateManyLessonInputEnvelope
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
  }

  export type LessonProgressUncheckedCreateNestedManyWithoutLessonInput = {
    create?: XOR<LessonProgressCreateWithoutLessonInput, LessonProgressUncheckedCreateWithoutLessonInput> | LessonProgressCreateWithoutLessonInput[] | LessonProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutLessonInput | LessonProgressCreateOrConnectWithoutLessonInput[]
    createMany?: LessonProgressCreateManyLessonInputEnvelope
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
  }

  export type LessonUpdatetopicsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type LessonProgressUpdateManyWithoutLessonNestedInput = {
    create?: XOR<LessonProgressCreateWithoutLessonInput, LessonProgressUncheckedCreateWithoutLessonInput> | LessonProgressCreateWithoutLessonInput[] | LessonProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutLessonInput | LessonProgressCreateOrConnectWithoutLessonInput[]
    upsert?: LessonProgressUpsertWithWhereUniqueWithoutLessonInput | LessonProgressUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: LessonProgressCreateManyLessonInputEnvelope
    set?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    disconnect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    delete?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    update?: LessonProgressUpdateWithWhereUniqueWithoutLessonInput | LessonProgressUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: LessonProgressUpdateManyWithWhereWithoutLessonInput | LessonProgressUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
  }

  export type LessonProgressUncheckedUpdateManyWithoutLessonNestedInput = {
    create?: XOR<LessonProgressCreateWithoutLessonInput, LessonProgressUncheckedCreateWithoutLessonInput> | LessonProgressCreateWithoutLessonInput[] | LessonProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutLessonInput | LessonProgressCreateOrConnectWithoutLessonInput[]
    upsert?: LessonProgressUpsertWithWhereUniqueWithoutLessonInput | LessonProgressUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: LessonProgressCreateManyLessonInputEnvelope
    set?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    disconnect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    delete?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    update?: LessonProgressUpdateWithWhereUniqueWithoutLessonInput | LessonProgressUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: LessonProgressUpdateManyWithWhereWithoutLessonInput | LessonProgressUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
  }

  export type LessonCreateNestedOneWithoutProgressInput = {
    create?: XOR<LessonCreateWithoutProgressInput, LessonUncheckedCreateWithoutProgressInput>
    connectOrCreate?: LessonCreateOrConnectWithoutProgressInput
    connect?: LessonWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLessonProgressInput = {
    create?: XOR<UserCreateWithoutLessonProgressInput, UserUncheckedCreateWithoutLessonProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutLessonProgressInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LessonUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<LessonCreateWithoutProgressInput, LessonUncheckedCreateWithoutProgressInput>
    connectOrCreate?: LessonCreateOrConnectWithoutProgressInput
    upsert?: LessonUpsertWithoutProgressInput
    connect?: LessonWhereUniqueInput
    update?: XOR<XOR<LessonUpdateToOneWithWhereWithoutProgressInput, LessonUpdateWithoutProgressInput>, LessonUncheckedUpdateWithoutProgressInput>
  }

  export type UserUpdateOneRequiredWithoutLessonProgressNestedInput = {
    create?: XOR<UserCreateWithoutLessonProgressInput, UserUncheckedCreateWithoutLessonProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutLessonProgressInput
    upsert?: UserUpsertWithoutLessonProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLessonProgressInput, UserUpdateWithoutLessonProgressInput>, UserUncheckedUpdateWithoutLessonProgressInput>
  }

  export type UserVocabularyCreateNestedManyWithoutVocabularyInput = {
    create?: XOR<UserVocabularyCreateWithoutVocabularyInput, UserVocabularyUncheckedCreateWithoutVocabularyInput> | UserVocabularyCreateWithoutVocabularyInput[] | UserVocabularyUncheckedCreateWithoutVocabularyInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutVocabularyInput | UserVocabularyCreateOrConnectWithoutVocabularyInput[]
    createMany?: UserVocabularyCreateManyVocabularyInputEnvelope
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
  }

  export type UserVocabularyUncheckedCreateNestedManyWithoutVocabularyInput = {
    create?: XOR<UserVocabularyCreateWithoutVocabularyInput, UserVocabularyUncheckedCreateWithoutVocabularyInput> | UserVocabularyCreateWithoutVocabularyInput[] | UserVocabularyUncheckedCreateWithoutVocabularyInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutVocabularyInput | UserVocabularyCreateOrConnectWithoutVocabularyInput[]
    createMany?: UserVocabularyCreateManyVocabularyInputEnvelope
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
  }

  export type UserVocabularyUpdateManyWithoutVocabularyNestedInput = {
    create?: XOR<UserVocabularyCreateWithoutVocabularyInput, UserVocabularyUncheckedCreateWithoutVocabularyInput> | UserVocabularyCreateWithoutVocabularyInput[] | UserVocabularyUncheckedCreateWithoutVocabularyInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutVocabularyInput | UserVocabularyCreateOrConnectWithoutVocabularyInput[]
    upsert?: UserVocabularyUpsertWithWhereUniqueWithoutVocabularyInput | UserVocabularyUpsertWithWhereUniqueWithoutVocabularyInput[]
    createMany?: UserVocabularyCreateManyVocabularyInputEnvelope
    set?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    disconnect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    delete?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    update?: UserVocabularyUpdateWithWhereUniqueWithoutVocabularyInput | UserVocabularyUpdateWithWhereUniqueWithoutVocabularyInput[]
    updateMany?: UserVocabularyUpdateManyWithWhereWithoutVocabularyInput | UserVocabularyUpdateManyWithWhereWithoutVocabularyInput[]
    deleteMany?: UserVocabularyScalarWhereInput | UserVocabularyScalarWhereInput[]
  }

  export type UserVocabularyUncheckedUpdateManyWithoutVocabularyNestedInput = {
    create?: XOR<UserVocabularyCreateWithoutVocabularyInput, UserVocabularyUncheckedCreateWithoutVocabularyInput> | UserVocabularyCreateWithoutVocabularyInput[] | UserVocabularyUncheckedCreateWithoutVocabularyInput[]
    connectOrCreate?: UserVocabularyCreateOrConnectWithoutVocabularyInput | UserVocabularyCreateOrConnectWithoutVocabularyInput[]
    upsert?: UserVocabularyUpsertWithWhereUniqueWithoutVocabularyInput | UserVocabularyUpsertWithWhereUniqueWithoutVocabularyInput[]
    createMany?: UserVocabularyCreateManyVocabularyInputEnvelope
    set?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    disconnect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    delete?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    connect?: UserVocabularyWhereUniqueInput | UserVocabularyWhereUniqueInput[]
    update?: UserVocabularyUpdateWithWhereUniqueWithoutVocabularyInput | UserVocabularyUpdateWithWhereUniqueWithoutVocabularyInput[]
    updateMany?: UserVocabularyUpdateManyWithWhereWithoutVocabularyInput | UserVocabularyUpdateManyWithWhereWithoutVocabularyInput[]
    deleteMany?: UserVocabularyScalarWhereInput | UserVocabularyScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutVocabularyInput = {
    create?: XOR<UserCreateWithoutVocabularyInput, UserUncheckedCreateWithoutVocabularyInput>
    connectOrCreate?: UserCreateOrConnectWithoutVocabularyInput
    connect?: UserWhereUniqueInput
  }

  export type VocabularyCreateNestedOneWithoutUserVocabularyInput = {
    create?: XOR<VocabularyCreateWithoutUserVocabularyInput, VocabularyUncheckedCreateWithoutUserVocabularyInput>
    connectOrCreate?: VocabularyCreateOrConnectWithoutUserVocabularyInput
    connect?: VocabularyWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutVocabularyNestedInput = {
    create?: XOR<UserCreateWithoutVocabularyInput, UserUncheckedCreateWithoutVocabularyInput>
    connectOrCreate?: UserCreateOrConnectWithoutVocabularyInput
    upsert?: UserUpsertWithoutVocabularyInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVocabularyInput, UserUpdateWithoutVocabularyInput>, UserUncheckedUpdateWithoutVocabularyInput>
  }

  export type VocabularyUpdateOneRequiredWithoutUserVocabularyNestedInput = {
    create?: XOR<VocabularyCreateWithoutUserVocabularyInput, VocabularyUncheckedCreateWithoutUserVocabularyInput>
    connectOrCreate?: VocabularyCreateOrConnectWithoutUserVocabularyInput
    upsert?: VocabularyUpsertWithoutUserVocabularyInput
    connect?: VocabularyWhereUniqueInput
    update?: XOR<XOR<VocabularyUpdateToOneWithWhereWithoutUserVocabularyInput, VocabularyUpdateWithoutUserVocabularyInput>, VocabularyUncheckedUpdateWithoutUserVocabularyInput>
  }

  export type UserCreateNestedOneWithoutConversationsInput = {
    create?: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConversationsInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutConversationsNestedInput = {
    create?: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConversationsInput
    upsert?: UserUpsertWithoutConversationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutConversationsInput, UserUpdateWithoutConversationsInput>, UserUncheckedUpdateWithoutConversationsInput>
  }

  export type MessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutConversationInput | MessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutConversationInput | MessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutConversationInput | MessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutConversationInput | MessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutConversationInput | MessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutConversationInput | MessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
  }

  export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    upsert?: ConversationUpsertWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutMessagesInput, ConversationUpdateWithoutMessagesInput>, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type UserCreateNestedOneWithoutExamResultsInput = {
    create?: XOR<UserCreateWithoutExamResultsInput, UserUncheckedCreateWithoutExamResultsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExamResultsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutExamResultsNestedInput = {
    create?: XOR<UserCreateWithoutExamResultsInput, UserUncheckedCreateWithoutExamResultsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExamResultsInput
    upsert?: UserUpsertWithoutExamResultsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExamResultsInput, UserUpdateWithoutExamResultsInput>, UserUncheckedUpdateWithoutExamResultsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LessonProgressCreateWithoutUserInput = {
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
    lesson: LessonCreateNestedOneWithoutProgressInput
  }

  export type LessonProgressUncheckedCreateWithoutUserInput = {
    id?: number
    lessonId: number
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressCreateOrConnectWithoutUserInput = {
    where: LessonProgressWhereUniqueInput
    create: XOR<LessonProgressCreateWithoutUserInput, LessonProgressUncheckedCreateWithoutUserInput>
  }

  export type LessonProgressCreateManyUserInputEnvelope = {
    data: LessonProgressCreateManyUserInput | LessonProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserVocabularyCreateWithoutUserInput = {
    learned?: boolean
    lastPracticed?: Date | string | null
    vocabulary: VocabularyCreateNestedOneWithoutUserVocabularyInput
  }

  export type UserVocabularyUncheckedCreateWithoutUserInput = {
    id?: number
    vocabularyId: number
    learned?: boolean
    lastPracticed?: Date | string | null
  }

  export type UserVocabularyCreateOrConnectWithoutUserInput = {
    where: UserVocabularyWhereUniqueInput
    create: XOR<UserVocabularyCreateWithoutUserInput, UserVocabularyUncheckedCreateWithoutUserInput>
  }

  export type UserVocabularyCreateManyUserInputEnvelope = {
    data: UserVocabularyCreateManyUserInput | UserVocabularyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExamResultCreateWithoutUserInput = {
    examId: string
    section: string
    level: string
    score: number
    details: JsonNullValueInput | InputJsonValue
    completedAt: Date | string
  }

  export type ExamResultUncheckedCreateWithoutUserInput = {
    id?: number
    examId: string
    section: string
    level: string
    score: number
    details: JsonNullValueInput | InputJsonValue
    completedAt: Date | string
  }

  export type ExamResultCreateOrConnectWithoutUserInput = {
    where: ExamResultWhereUniqueInput
    create: XOR<ExamResultCreateWithoutUserInput, ExamResultUncheckedCreateWithoutUserInput>
  }

  export type ExamResultCreateManyUserInputEnvelope = {
    data: ExamResultCreateManyUserInput | ExamResultCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ConversationCreateWithoutUserInput = {
    id?: string
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
    messages?: MessageCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutUserInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutUserInput, ConversationUncheckedCreateWithoutUserInput>
  }

  export type ConversationCreateManyUserInputEnvelope = {
    data: ConversationCreateManyUserInput | ConversationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LessonProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: LessonProgressWhereUniqueInput
    update: XOR<LessonProgressUpdateWithoutUserInput, LessonProgressUncheckedUpdateWithoutUserInput>
    create: XOR<LessonProgressCreateWithoutUserInput, LessonProgressUncheckedCreateWithoutUserInput>
  }

  export type LessonProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: LessonProgressWhereUniqueInput
    data: XOR<LessonProgressUpdateWithoutUserInput, LessonProgressUncheckedUpdateWithoutUserInput>
  }

  export type LessonProgressUpdateManyWithWhereWithoutUserInput = {
    where: LessonProgressScalarWhereInput
    data: XOR<LessonProgressUpdateManyMutationInput, LessonProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type LessonProgressScalarWhereInput = {
    AND?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
    OR?: LessonProgressScalarWhereInput[]
    NOT?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
    id?: IntFilter<"LessonProgress"> | number
    lessonId?: IntFilter<"LessonProgress"> | number
    userId?: IntFilter<"LessonProgress"> | number
    completed?: BoolFilter<"LessonProgress"> | boolean
    score?: IntFilter<"LessonProgress"> | number
    startedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    answers?: JsonNullableFilter<"LessonProgress">
  }

  export type UserVocabularyUpsertWithWhereUniqueWithoutUserInput = {
    where: UserVocabularyWhereUniqueInput
    update: XOR<UserVocabularyUpdateWithoutUserInput, UserVocabularyUncheckedUpdateWithoutUserInput>
    create: XOR<UserVocabularyCreateWithoutUserInput, UserVocabularyUncheckedCreateWithoutUserInput>
  }

  export type UserVocabularyUpdateWithWhereUniqueWithoutUserInput = {
    where: UserVocabularyWhereUniqueInput
    data: XOR<UserVocabularyUpdateWithoutUserInput, UserVocabularyUncheckedUpdateWithoutUserInput>
  }

  export type UserVocabularyUpdateManyWithWhereWithoutUserInput = {
    where: UserVocabularyScalarWhereInput
    data: XOR<UserVocabularyUpdateManyMutationInput, UserVocabularyUncheckedUpdateManyWithoutUserInput>
  }

  export type UserVocabularyScalarWhereInput = {
    AND?: UserVocabularyScalarWhereInput | UserVocabularyScalarWhereInput[]
    OR?: UserVocabularyScalarWhereInput[]
    NOT?: UserVocabularyScalarWhereInput | UserVocabularyScalarWhereInput[]
    id?: IntFilter<"UserVocabulary"> | number
    userId?: IntFilter<"UserVocabulary"> | number
    vocabularyId?: IntFilter<"UserVocabulary"> | number
    learned?: BoolFilter<"UserVocabulary"> | boolean
    lastPracticed?: DateTimeNullableFilter<"UserVocabulary"> | Date | string | null
  }

  export type ExamResultUpsertWithWhereUniqueWithoutUserInput = {
    where: ExamResultWhereUniqueInput
    update: XOR<ExamResultUpdateWithoutUserInput, ExamResultUncheckedUpdateWithoutUserInput>
    create: XOR<ExamResultCreateWithoutUserInput, ExamResultUncheckedCreateWithoutUserInput>
  }

  export type ExamResultUpdateWithWhereUniqueWithoutUserInput = {
    where: ExamResultWhereUniqueInput
    data: XOR<ExamResultUpdateWithoutUserInput, ExamResultUncheckedUpdateWithoutUserInput>
  }

  export type ExamResultUpdateManyWithWhereWithoutUserInput = {
    where: ExamResultScalarWhereInput
    data: XOR<ExamResultUpdateManyMutationInput, ExamResultUncheckedUpdateManyWithoutUserInput>
  }

  export type ExamResultScalarWhereInput = {
    AND?: ExamResultScalarWhereInput | ExamResultScalarWhereInput[]
    OR?: ExamResultScalarWhereInput[]
    NOT?: ExamResultScalarWhereInput | ExamResultScalarWhereInput[]
    id?: IntFilter<"ExamResult"> | number
    userId?: IntFilter<"ExamResult"> | number
    examId?: StringFilter<"ExamResult"> | string
    section?: StringFilter<"ExamResult"> | string
    level?: StringFilter<"ExamResult"> | string
    score?: IntFilter<"ExamResult"> | number
    details?: JsonFilter<"ExamResult">
    completedAt?: DateTimeFilter<"ExamResult"> | Date | string
  }

  export type ConversationUpsertWithWhereUniqueWithoutUserInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutUserInput, ConversationUncheckedUpdateWithoutUserInput>
    create: XOR<ConversationCreateWithoutUserInput, ConversationUncheckedCreateWithoutUserInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutUserInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutUserInput, ConversationUncheckedUpdateWithoutUserInput>
  }

  export type ConversationUpdateManyWithWhereWithoutUserInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutUserInput>
  }

  export type ConversationScalarWhereInput = {
    AND?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
    OR?: ConversationScalarWhereInput[]
    NOT?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
    id?: StringFilter<"Conversation"> | string
    userId?: IntFilter<"Conversation"> | number
    title?: StringFilter<"Conversation"> | string
    context?: StringFilter<"Conversation"> | string
    startedAt?: DateTimeFilter<"Conversation"> | Date | string
    lastMessageAt?: DateTimeFilter<"Conversation"> | Date | string
  }

  export type LessonProgressCreateWithoutLessonInput = {
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutLessonProgressInput
  }

  export type LessonProgressUncheckedCreateWithoutLessonInput = {
    id?: number
    userId: number
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressCreateOrConnectWithoutLessonInput = {
    where: LessonProgressWhereUniqueInput
    create: XOR<LessonProgressCreateWithoutLessonInput, LessonProgressUncheckedCreateWithoutLessonInput>
  }

  export type LessonProgressCreateManyLessonInputEnvelope = {
    data: LessonProgressCreateManyLessonInput | LessonProgressCreateManyLessonInput[]
    skipDuplicates?: boolean
  }

  export type LessonProgressUpsertWithWhereUniqueWithoutLessonInput = {
    where: LessonProgressWhereUniqueInput
    update: XOR<LessonProgressUpdateWithoutLessonInput, LessonProgressUncheckedUpdateWithoutLessonInput>
    create: XOR<LessonProgressCreateWithoutLessonInput, LessonProgressUncheckedCreateWithoutLessonInput>
  }

  export type LessonProgressUpdateWithWhereUniqueWithoutLessonInput = {
    where: LessonProgressWhereUniqueInput
    data: XOR<LessonProgressUpdateWithoutLessonInput, LessonProgressUncheckedUpdateWithoutLessonInput>
  }

  export type LessonProgressUpdateManyWithWhereWithoutLessonInput = {
    where: LessonProgressScalarWhereInput
    data: XOR<LessonProgressUpdateManyMutationInput, LessonProgressUncheckedUpdateManyWithoutLessonInput>
  }

  export type LessonCreateWithoutProgressInput = {
    title: string
    description: string
    level: string
    duration: number
    topics?: LessonCreatetopicsInput | string[]
    content: JsonNullValueInput | InputJsonValue
  }

  export type LessonUncheckedCreateWithoutProgressInput = {
    id?: number
    title: string
    description: string
    level: string
    duration: number
    topics?: LessonCreatetopicsInput | string[]
    content: JsonNullValueInput | InputJsonValue
  }

  export type LessonCreateOrConnectWithoutProgressInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutProgressInput, LessonUncheckedCreateWithoutProgressInput>
  }

  export type UserCreateWithoutLessonProgressInput = {
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    vocabulary?: UserVocabularyCreateNestedManyWithoutUserInput
    examResults?: ExamResultCreateNestedManyWithoutUserInput
    conversations?: ConversationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLessonProgressInput = {
    id?: number
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    vocabulary?: UserVocabularyUncheckedCreateNestedManyWithoutUserInput
    examResults?: ExamResultUncheckedCreateNestedManyWithoutUserInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLessonProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLessonProgressInput, UserUncheckedCreateWithoutLessonProgressInput>
  }

  export type LessonUpsertWithoutProgressInput = {
    update: XOR<LessonUpdateWithoutProgressInput, LessonUncheckedUpdateWithoutProgressInput>
    create: XOR<LessonCreateWithoutProgressInput, LessonUncheckedCreateWithoutProgressInput>
    where?: LessonWhereInput
  }

  export type LessonUpdateToOneWithWhereWithoutProgressInput = {
    where?: LessonWhereInput
    data: XOR<LessonUpdateWithoutProgressInput, LessonUncheckedUpdateWithoutProgressInput>
  }

  export type LessonUpdateWithoutProgressInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    topics?: LessonUpdatetopicsInput | string[]
    content?: JsonNullValueInput | InputJsonValue
  }

  export type LessonUncheckedUpdateWithoutProgressInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    topics?: LessonUpdatetopicsInput | string[]
    content?: JsonNullValueInput | InputJsonValue
  }

  export type UserUpsertWithoutLessonProgressInput = {
    update: XOR<UserUpdateWithoutLessonProgressInput, UserUncheckedUpdateWithoutLessonProgressInput>
    create: XOR<UserCreateWithoutLessonProgressInput, UserUncheckedCreateWithoutLessonProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLessonProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLessonProgressInput, UserUncheckedUpdateWithoutLessonProgressInput>
  }

  export type UserUpdateWithoutLessonProgressInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    vocabulary?: UserVocabularyUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUpdateManyWithoutUserNestedInput
    conversations?: ConversationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLessonProgressInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    vocabulary?: UserVocabularyUncheckedUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUncheckedUpdateManyWithoutUserNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserVocabularyCreateWithoutVocabularyInput = {
    learned?: boolean
    lastPracticed?: Date | string | null
    user: UserCreateNestedOneWithoutVocabularyInput
  }

  export type UserVocabularyUncheckedCreateWithoutVocabularyInput = {
    id?: number
    userId: number
    learned?: boolean
    lastPracticed?: Date | string | null
  }

  export type UserVocabularyCreateOrConnectWithoutVocabularyInput = {
    where: UserVocabularyWhereUniqueInput
    create: XOR<UserVocabularyCreateWithoutVocabularyInput, UserVocabularyUncheckedCreateWithoutVocabularyInput>
  }

  export type UserVocabularyCreateManyVocabularyInputEnvelope = {
    data: UserVocabularyCreateManyVocabularyInput | UserVocabularyCreateManyVocabularyInput[]
    skipDuplicates?: boolean
  }

  export type UserVocabularyUpsertWithWhereUniqueWithoutVocabularyInput = {
    where: UserVocabularyWhereUniqueInput
    update: XOR<UserVocabularyUpdateWithoutVocabularyInput, UserVocabularyUncheckedUpdateWithoutVocabularyInput>
    create: XOR<UserVocabularyCreateWithoutVocabularyInput, UserVocabularyUncheckedCreateWithoutVocabularyInput>
  }

  export type UserVocabularyUpdateWithWhereUniqueWithoutVocabularyInput = {
    where: UserVocabularyWhereUniqueInput
    data: XOR<UserVocabularyUpdateWithoutVocabularyInput, UserVocabularyUncheckedUpdateWithoutVocabularyInput>
  }

  export type UserVocabularyUpdateManyWithWhereWithoutVocabularyInput = {
    where: UserVocabularyScalarWhereInput
    data: XOR<UserVocabularyUpdateManyMutationInput, UserVocabularyUncheckedUpdateManyWithoutVocabularyInput>
  }

  export type UserCreateWithoutVocabularyInput = {
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressCreateNestedManyWithoutUserInput
    examResults?: ExamResultCreateNestedManyWithoutUserInput
    conversations?: ConversationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVocabularyInput = {
    id?: number
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutUserInput
    examResults?: ExamResultUncheckedCreateNestedManyWithoutUserInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVocabularyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVocabularyInput, UserUncheckedCreateWithoutVocabularyInput>
  }

  export type VocabularyCreateWithoutUserVocabularyInput = {
    word: string
    translation: string
    example: string
    level: string
  }

  export type VocabularyUncheckedCreateWithoutUserVocabularyInput = {
    id?: number
    word: string
    translation: string
    example: string
    level: string
  }

  export type VocabularyCreateOrConnectWithoutUserVocabularyInput = {
    where: VocabularyWhereUniqueInput
    create: XOR<VocabularyCreateWithoutUserVocabularyInput, VocabularyUncheckedCreateWithoutUserVocabularyInput>
  }

  export type UserUpsertWithoutVocabularyInput = {
    update: XOR<UserUpdateWithoutVocabularyInput, UserUncheckedUpdateWithoutVocabularyInput>
    create: XOR<UserCreateWithoutVocabularyInput, UserUncheckedCreateWithoutVocabularyInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVocabularyInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVocabularyInput, UserUncheckedUpdateWithoutVocabularyInput>
  }

  export type UserUpdateWithoutVocabularyInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUpdateManyWithoutUserNestedInput
    conversations?: ConversationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVocabularyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUncheckedUpdateManyWithoutUserNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type VocabularyUpsertWithoutUserVocabularyInput = {
    update: XOR<VocabularyUpdateWithoutUserVocabularyInput, VocabularyUncheckedUpdateWithoutUserVocabularyInput>
    create: XOR<VocabularyCreateWithoutUserVocabularyInput, VocabularyUncheckedCreateWithoutUserVocabularyInput>
    where?: VocabularyWhereInput
  }

  export type VocabularyUpdateToOneWithWhereWithoutUserVocabularyInput = {
    where?: VocabularyWhereInput
    data: XOR<VocabularyUpdateWithoutUserVocabularyInput, VocabularyUncheckedUpdateWithoutUserVocabularyInput>
  }

  export type VocabularyUpdateWithoutUserVocabularyInput = {
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    example?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
  }

  export type VocabularyUncheckedUpdateWithoutUserVocabularyInput = {
    id?: IntFieldUpdateOperationsInput | number
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    example?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateWithoutConversationsInput = {
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressCreateNestedManyWithoutUserInput
    vocabulary?: UserVocabularyCreateNestedManyWithoutUserInput
    examResults?: ExamResultCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutConversationsInput = {
    id?: number
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutUserInput
    vocabulary?: UserVocabularyUncheckedCreateNestedManyWithoutUserInput
    examResults?: ExamResultUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutConversationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
  }

  export type MessageCreateWithoutConversationInput = {
    role: string
    content: string
    timestamp?: Date | string
  }

  export type MessageUncheckedCreateWithoutConversationInput = {
    id?: number
    role: string
    content: string
    timestamp?: Date | string
  }

  export type MessageCreateOrConnectWithoutConversationInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput>
  }

  export type MessageCreateManyConversationInputEnvelope = {
    data: MessageCreateManyConversationInput | MessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutConversationsInput = {
    update: XOR<UserUpdateWithoutConversationsInput, UserUncheckedUpdateWithoutConversationsInput>
    create: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutConversationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutConversationsInput, UserUncheckedUpdateWithoutConversationsInput>
  }

  export type UserUpdateWithoutConversationsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUpdateManyWithoutUserNestedInput
    vocabulary?: UserVocabularyUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutConversationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutUserNestedInput
    vocabulary?: UserVocabularyUncheckedUpdateManyWithoutUserNestedInput
    examResults?: ExamResultUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutConversationInput, MessageUncheckedUpdateWithoutConversationInput>
    create: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutConversationInput, MessageUncheckedUpdateWithoutConversationInput>
  }

  export type MessageUpdateManyWithWhereWithoutConversationInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: IntFilter<"Message"> | number
    conversationId?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    timestamp?: DateTimeFilter<"Message"> | Date | string
  }

  export type ConversationCreateWithoutMessagesInput = {
    id?: string
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
    user: UserCreateNestedOneWithoutConversationsInput
  }

  export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId: number
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
  }

  export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
  }

  export type ConversationUpsertWithoutMessagesInput = {
    update: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutConversationsNestedInput
  }

  export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutExamResultsInput = {
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressCreateNestedManyWithoutUserInput
    vocabulary?: UserVocabularyCreateNestedManyWithoutUserInput
    conversations?: ConversationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExamResultsInput = {
    id?: number
    email: string
    name: string
    password?: string | null
    level?: string
    points?: number
    streakDays?: number
    joinedAt?: Date | string
    learningGoals?: UserCreatelearningGoalsInput | string[]
    completedLessons?: number
    lastActive?: Date | string
    dailyGoal?: number
    notifications?: boolean
    theme?: string
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutUserInput
    vocabulary?: UserVocabularyUncheckedCreateNestedManyWithoutUserInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExamResultsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExamResultsInput, UserUncheckedCreateWithoutExamResultsInput>
  }

  export type UserUpsertWithoutExamResultsInput = {
    update: XOR<UserUpdateWithoutExamResultsInput, UserUncheckedUpdateWithoutExamResultsInput>
    create: XOR<UserCreateWithoutExamResultsInput, UserUncheckedCreateWithoutExamResultsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExamResultsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExamResultsInput, UserUncheckedUpdateWithoutExamResultsInput>
  }

  export type UserUpdateWithoutExamResultsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUpdateManyWithoutUserNestedInput
    vocabulary?: UserVocabularyUpdateManyWithoutUserNestedInput
    conversations?: ConversationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExamResultsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    level?: StringFieldUpdateOperationsInput | string
    points?: IntFieldUpdateOperationsInput | number
    streakDays?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    completedLessons?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyGoal?: IntFieldUpdateOperationsInput | number
    notifications?: BoolFieldUpdateOperationsInput | boolean
    theme?: StringFieldUpdateOperationsInput | string
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutUserNestedInput
    vocabulary?: UserVocabularyUncheckedUpdateManyWithoutUserNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LessonProgressCreateManyUserInput = {
    id?: number
    lessonId: number
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserVocabularyCreateManyUserInput = {
    id?: number
    vocabularyId: number
    learned?: boolean
    lastPracticed?: Date | string | null
  }

  export type ExamResultCreateManyUserInput = {
    id?: number
    examId: string
    section: string
    level: string
    score: number
    details: JsonNullValueInput | InputJsonValue
    completedAt: Date | string
  }

  export type ConversationCreateManyUserInput = {
    id?: string
    title: string
    context: string
    startedAt?: Date | string
    lastMessageAt?: Date | string
  }

  export type LessonProgressUpdateWithoutUserInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
    lesson?: LessonUpdateOneRequiredWithoutProgressNestedInput
  }

  export type LessonProgressUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    lessonId?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    lessonId?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserVocabularyUpdateWithoutUserInput = {
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vocabulary?: VocabularyUpdateOneRequiredWithoutUserVocabularyNestedInput
  }

  export type UserVocabularyUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    vocabularyId?: IntFieldUpdateOperationsInput | number
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserVocabularyUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    vocabularyId?: IntFieldUpdateOperationsInput | number
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamResultUpdateWithoutUserInput = {
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamResultUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamResultUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    examId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    details?: JsonNullValueInput | InputJsonValue
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LessonProgressCreateManyLessonInput = {
    id?: number
    userId: number
    completed?: boolean
    score?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressUpdateWithoutLessonInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutLessonProgressNestedInput
  }

  export type LessonProgressUncheckedUpdateWithoutLessonInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LessonProgressUncheckedUpdateManyWithoutLessonInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserVocabularyCreateManyVocabularyInput = {
    id?: number
    userId: number
    learned?: boolean
    lastPracticed?: Date | string | null
  }

  export type UserVocabularyUpdateWithoutVocabularyInput = {
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutVocabularyNestedInput
  }

  export type UserVocabularyUncheckedUpdateWithoutVocabularyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserVocabularyUncheckedUpdateManyWithoutVocabularyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    learned?: BoolFieldUpdateOperationsInput | boolean
    lastPracticed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageCreateManyConversationInput = {
    id?: number
    role: string
    content: string
    timestamp?: Date | string
  }

  export type MessageUpdateWithoutConversationInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutConversationInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutConversationInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}