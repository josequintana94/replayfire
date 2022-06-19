const { db } = require("../admin");

exports.partidos = async (req, res) => {
    // Create a reference to the partidos collection
    const partidosRef = db.collection('partidos');
    // Create a query against the collection
    const queryRef = partidosRef.where('estado', '!=', 'finalizado');

    try{
            queryRef.get().then((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
            console.log(data);
            return res.status(201).json(data);
        })
    } catch (error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});          
    }
};