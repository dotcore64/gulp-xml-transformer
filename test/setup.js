import { describe, it } from "node:test";

import { use } from "chai";

globalThis.describe = describe;
globalThis.it = it;

use((await import("sinon-chai")).default); // eslint-disable-line unicorn/no-await-expression-member
use((await import("chai-as-promised")).default); // eslint-disable-line unicorn/no-await-expression-member
use((await import("dirty-chai")).default); // eslint-disable-line unicorn/no-await-expression-member
