const isExists = async (filter, model) => {
    try {
        return await model.findOne(filter)
    } catch (error) {
        console.error("Error - isExists ", error)
        throw new Error(error)
    }
}

const create = async (data, model) => {
    try {
        return await model.create(data)
    } catch (error) {
        console.error("Error - create ", error)
        throw new Error(error)
    }
}

const isPassMatched = async (data, model, func) => {
    try {
        return model.call(func(data))
    } catch (error) {
        console.error("Error - isPassMatched ", error)
        throw new Error(error)
    }
}

const updateOne = async (filter, data, model) => {
    try {
        return await model.updateOne(filter, data)
    } catch (error) {
        console.error("Error - updateOne ", error)
        throw new Error(error)
    }
}

const findOneAndUpdate = async (filter, data, model) => {
    try {
        return await model.findOneAndUpdate(filter, data, { returnDocument: "after", upsert: true })
    } catch (error) {
        console.error("Error - findOneAndUpdate ", error)
        throw new Error(error)
    }
}

module.exports = {
    isExists,
    create,
    isPassMatched,
    updateOne,
    findOneAndUpdate
}