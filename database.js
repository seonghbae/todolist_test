import { showTodoList } from "./index.js"

const onRequest = indexedDB.open('tomato-do', 1)

onRequest.onsuccess = async () => {
    const initialData = await getEntryFromDb("todolist")
    // initialData는 배열인데, 길이가 0이라면 초기 데이터가 없다는 의미이며, 0이 아니면 있는 경우임.
    const isInitialData = initialData.length === 0 ? false : true

    if (!isInitialData) {
        // 초기 데이터 삽입
        addEntryToDb('todolist', '복습하기')
        addEntryToDb('todolist', '넷플릭스 보기')
    }

    showTodoList();
}

onRequest.onupgradeneeded = () => {
    const database = onRequest.result
    database.createObjectStore('todolist', {autoIncrement: true})
}

onRequest.onerror = () => {
    alert('Error creating or accessing db')
}

const getKeyFromDb = (storeName, entry) => {

    const data = new Promise((resolve, reject) => {
        const database = onRequest.result
        const transaction = database.transaction([storeName])
        const store = transaction.objectStore(storeName)
    
        const request = store.openCursor()
        request.onerror = () => {
            console.log('error getting data from the store')
            reject(request.error)
        }
    
        request.onsuccess = () => {
            let cursor = request.result;
            // console.log(cursor);
            if(cursor) {
                if(cursor.value === entry) {
                    resolve(cursor.key);
                } else cursor.continue();
            }
        }
    })
  
    return Promise.resolve(data)
}

const addEntryToDb = (storeName, entry) => {
    const database = onRequest.result;
    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.add(entry);
}

const getEntryFromDb = (storeName, id) => {
    // 비동기 처리로 데이터를 가져옵니다. 
    // 데이터를 가져오는 행위는 항상 비동기로 이루어집니다.
    const data = new Promise((resolve, reject) => {
        const database = onRequest.result
        const transaction = database.transaction([storeName])
        const store = transaction.objectStore(storeName)
        
        // id 인자가 있다면 특정 id의 데이터만 가져오면 되며, 인자가 없다면 모든 데이터를 가져옴.
        const request = id ? store.get(id) : store.getAll()
        request.onerror = () => {
            reject(request.error)
            console.log('error getting data from the store')
        }

        request.onsuccess = () => {
            resolve(request.result)
        }
    })
  
    return Promise.resolve(data)
}

const deleteEntryFromDb = async (storeName, entry) => {
    const id = await getKeyFromDb(storeName, entry);

    const database = onRequest.result;
    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(id);
    return new Promise((resolve, reject) => {
        request.onerror = () => {
            reject(request.error)
            console.log('error getting data from the store')
        }
    
        request.onsuccess = () => {
            resolve(request.result)
        }
    });
}

const clearAllEntries = (storeName) => {
    const database = onRequest.result;
    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();
}

export { addEntryToDb, getEntryFromDb, deleteEntryFromDb, clearAllEntries }