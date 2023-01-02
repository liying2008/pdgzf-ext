
/**
 * {
 *   project1: {
 *     property1: value1,
 *     property2: value2,
 *     ...
 *   },
 *   project2: {
 *     property1: value1,
 *     property2: value2,
 *     ...
 *   },
 *   ...
 * }
 */
export type ProjectPropertyValues = Record<string, Record<string, string>>
