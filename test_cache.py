import requests 
import time
import random
palabras = ["about", "after", "again", "almost", "along", "already", "also", "although", "always", "amazing", "another", "anybody", "anyone", "anything", "anywhere", "around", "because", "before", "behind", "below", "beneath", "beside", "between", "beyond", "breath", "build", "building", "business", "cannot", "carriage", "carry", "change", "children", "church", "clothing", "colour", "coming", "country", 
            "credit", "current", "dangerous", "dearly", "deeply", "different", "difficult", "direction", "distance", "doctor", "during",
              "easily", "either", "enough", "evening", "everyone", "everything", "everywhere", "exactly", "example", "except", "explain", 
              "famous", "farther", "father", "favourite", "feeling", "fifteen", "finally", "follow", "footsteps", "friendship", "frightened", "furniture",
                "gentlemen", "getting", "golden", "happening", "happily", "happiness", "heavily", "however", "hundred", "husband", "immediately", 
                "important", "include", "including", "influence", "inside", "instead", "interest", "interesting", "itself", "jacket", "kitchen", "knowing", "language", 
                "laughing", "length", "letting", "library", "lifting", "lighting", "listening", "lonely", "looking", "making", "maybe", "meeting", "message", "mileage"
                , "million", "minute", "modern", "moment", "morning", "mostly", "mountain", "moving", "myself", "narrow", "national", "nearest", "neither", "nothing",
                  "nowhere", "obvious", "occasion", "opening", "ordinary", "outside", "overhead", "painting", "palest", "parents", "parties", "partner", "pattern", "people", 
                  "perfect", "perhaps", "picture", "pleasure", "poetry", "polite", "possible", "praise", "prepared", "presence", "pressure", "previous", "printed", "problem",
                    "probably", "produced", "promise", "properly", "purpose", "quietly", "reading", "realize", "received", "recently", "recognized", "reflection", "repeated", 
                    "replied", "report", "returned", "satisfactory", "several", "shaking", "shallow", "shoulder", "showing", "silence", "similar", "simplest", "simply", 
                    "sincerely", "slightly", "smiling", "something", "sometimes", "somewhere", "songwriter", "speech", "spending", "spirit", "starting", "stopping", 
                    "straight", "stranger", "stretched", "studies", "studying", "stupid", "suddenly", "summer", "suppose", "surface", "surprise", "surprising", 
                    "swimming", "taking", "teaching", "television", "themselves", "therefore", "thickly", "thinking"]



def call_api(endpoint , query):
    data = {'palabra': query}
    response = requests.post(endpoint,json=data)
    print(response)
    return


f = open('./probando_cache.txt','a')
for i in range(2500):
    consulta_escogida = random.choice(palabras)
    inicio = time.time()
    call_api('http://localhost:3001/buscar',consulta_escogida)
    fin  = time.time()
    tiempo = fin - inicio
    f.write('\n' + f"{tiempo}")
f.close()  