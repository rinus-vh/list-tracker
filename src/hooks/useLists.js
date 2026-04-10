import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useLists(uid) {
  const [listsData, setListsData] = useState({})

  useEffect(() => {
    if (!uid) {
      setListsData({})
      return
    }
    const ref = collection(db, 'users', uid, 'lists')
    return onSnapshot(ref, snap => {
      const data = {}
      snap.forEach(d => { data[d.id] = d.data() })
      setListsData(data)
    })
  }, [uid])

  return { listsData }
}
