import { collection, doc, getFirestore, getDoc } from "firebase/firestore";

const fetchLibrary = async (user) => {
  let library = {};
  let loading = false;

  try {
    const db = getFirestore();
    const userId = user?.uid;
    const imagesRef = doc(collection(db, "images"), userId);
    const docSnapshot = await getDoc(imagesRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      library = Object.entries(userData).map(([category, images]) => ({
        category,
        images,
      }));
      loading = true;
    }
  } catch (error) {
    console.error("Error checking saved status", error);
  }

  return { library, loading };
};

export default fetchLibrary;
