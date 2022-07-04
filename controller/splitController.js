require("dotenv").config();

const split = async (req, res) => {
    const arr = validate(req.body);
    if (arr.length > 0) {
        let error = {};
        error.message = "Check the errors belows to make sure that all the neccessary parameters are sent";
        error.body = arr;
        return errorResponse(req, res, error);
    }
    const body = req.body;
    let response = {};
    response.ID = body.ID;
    response.Balance = body.Amount;
    response.SplitBreakdown = [];
    response = computeSplit(response, body);
    return res.json(response);
}

const computeSplit = (response, body) => {
    const flat = [];
    const percent = [];
    const ratio = [];
    let sumRatio = 0;

    body.SplitInfo.forEach(element => {
        if(element.SplitType==="FLAT"){
            flat.push(element);
        }
        else if(element.SplitType==="PERCENTAGE"){
            percent.push(element);
        }
        else if(element.SplitType==="RATIO"){
            sumRatio += element.SplitValue;
            ratio.push(element);
        }
    });
    flat.forEach(element => {
        response.Balance -= element.SplitValue;
        response.SplitBreakdown.push({
            SplitEntityId: element.SplitEntityId,
            Amount: element.SplitValue
        })
    });
    percent.forEach(element => {
        const value = (element.SplitValue/100) * response.Balance;
        response.Balance -= value;
        response.SplitBreakdown.push({
            SplitEntityId: element.SplitEntityId,
            Amount: value
        })
    });
    const balance = response.Balance;
    ratio.forEach(element => {
        const value = (element.SplitValue/sumRatio) * balance;
        response.Balance -= value;
        response.SplitBreakdown.push({
            SplitEntityId: element.SplitEntityId,
            Amount: value
        })
    });
    return response;
}

const validate = (body) => {
    let errorMessage = [];
    if (!body.ID) {
        errorMessage.push({
            "fieldName": "ID",
            "message": "ID is required"
        });
    };
    if (!body.Amount) {
        errorMessage.push({
            "fieldName": "Amount",
            "message": "Amount is required"
        });
    }
    if (!body.Currency) {
        errorMessage.push({
            "fieldName": "Currency",
            "message": "Currency is required"
        });
    }
    if (!body.CustomerEmail) {
        errorMessage.push({
            "fieldName": "CustomerEmail",
            "message": "CustomerEmail is required"
        });
    }
    if (!body.SplitInfo || body.SplitInfo.length<1) {
        errorMessage.push({
            "fieldName": "SplitInfo",
            "message": "SplitInfo is required and should have at least 1 item"
        });
    }
    return errorMessage;
}

const errorResponse = (req, res, error) => {
    console.log(error);
    return res.status(400).json({
        success: false,
        message: error.message,
        error: error.body
    });
}

module.exports = {
    split
}