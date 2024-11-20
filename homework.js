function checkPrototypeChain(obj) {
    if (typeof obj != 'object' || obj === null) {
        return 0;
    }
    let proto = Object.getPrototypeOf(obj);
    let count = 0;
    if (proto != null) {
        count = 1;
    }

    while (proto) {
        proto = Object.getPrototypeOf(proto);
        if (proto === null) { return count;}
        ++count;
    }

    return count;
}


function analyzeSparseArray(arr) {
    let map = new Map();
    map.set('total', arr.length);
    map.set('undefined', 0);
    map.set('null', 0);
    map.set('sparse', 0);
    
    let count = 0;
    for (let elem in arr) {
        if (arr[elem] === undefined) {
            map.set('undefined', (map.get('undefined')) + 1);
        }
        if (arr[elem] === null) {
            map.set('null', (map.get('null')) + 1);
        }
        ++count;
    }
    map.set('sparse', arr.length - count);

    return map;
}

// let arr = [1, , undefined, , null, , undefined, null, NaN, 0];


// console.log(analyzeSparseArray(arr));

let obj3 = {
    a: 4,
    s: undefined,
    d: null,
    f: undefined,
    g: NaN,
    h: 'hello',
    q: {
        i: 5,
        j: undefined,
        k: NaN,
        w: {
            p: undefined,
        }
    },
}

function testJSONSerialization(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            testJSONSerialization(obj[key]);
        }
        if (obj[key] === undefined) {
            obj[key] = null;
        }
    }

    console.log(JSON.stringify(obj));
}

// testJSONSerialization(obj3);

const obj4 = {
    a: 10,
    b: null,
    c: {
        d: 2,
        e: null
    },
    f: undefined
};

const obj5 = {
    a: 1,
    b: undefined,
    c: {
        d: 3
    },
    g: 5
};


function deepDiffChecker(obj1, obj2) {
    if (obj1 === null && obj2 === null) {
        return {};
    }
    let res = {
        'missing properties': [],
        'null vs undefined': [],
        'value mismatches': [],
    };

    for (let key in obj1) {
        if (obj2.hasOwnProperty(key)) {
            if (obj1[key] === null && obj2[key] === undefined) {
                res['null vs undefined'].push(`'${key}' is null in obj1, but undefined in obj2`);
            } else if (obj1[key] !== obj2[key]) { 
                res['value mismatches'].push(`'${key}' is ${obj1[key]} in obj1, but ${obj2[key]} in obj2`);
            }
        } else {
            res['missing properties'].push(`'${key}' is present in obj1, but missing in obj2`);
        }
    }

    for (let key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            res['missing properties'].push(`'${key}' is present in obj2, but missing in obj1`);
        }
        if (obj2[key] === null && obj1[key] === undefined) {
            res['null vs undefined'].push(`'${key}' is null in obj2, but undefined in obj1`);
        }
    }

    return res;
}

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    append(value) {
        let newNode = new Node(value);

        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        ++this.size;
    };

    prepend(value) {
        let newNode = new Node(value);
        // if (!this.head) {
        //     this.head = newNode;
        // }
        newNode.next = this.head;
        this.head = newNode;
        ++this.size;
    };

    removeByValue(value) {
        if (!this.head) {
            return;
        }

        if (this.head.value === value) {
            this.head = this.head.next;
            --this.size;
            return;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }
        if (current.next) {
            current.next = current.next.next;
            --this.size;
        }
    };

    removeByIndex(index) {
        if (index < 0 || index >= this.size) {
            return;
        }
        if (index === 0) {
            this.head = this.head.next;
            --this.size;
            return;
        }

        let current = this.head;
        for (let i = 0; i < index - 1; ++i) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            --this.size;
        }

    };

    search(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }

        return null;
    }

    insert(value, index) {
        if (index < 0 || index >= this.size) {
            return;
        }
        if (index === 0) {
            this.prepend(value);
            return;
        }
        let newNode = new Node(value);
        let current = this.head;
        for (let i = 0; i < index - 1; ++i) {
            current = current.next;
        }
        newNode.next = current.next;
        current.next = newNode;
        ++this.size;
    }

    toString() {
        let res = '';
        let current = this.head;
        while (current) {
            res += current.value + ' -> ';
            current = current.next;
        }

        return res + 'null';
    }
}
