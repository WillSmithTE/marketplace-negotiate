import openai
from pydantic import BaseModel
import json

def simpleRequest(req: str):
    result = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
            {"role": "system", "content": req}
        ]
    )
    return result.choices[-1].message.content

class ListingDetails(BaseModel):
    sellerName: str
    itemName: str
    listedPrice: float

def getListingDetails(fullListing: str) -> ListingDetails:
    result = simpleRequest(f"""this is a marketplace item listing, followed by some suggested questions. Ignore the questions. Tell me the seller name, listed price, and item name, as json like this structure: {{sellerName: "$name", listedPrice: $price, itemName: "$item"}}
        {fullListing}""")
    return ListingDetails(**json.loads(result))

