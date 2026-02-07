import requests
import os
import time

# Configuration
CLASSES = {
    "Eczema": "atopic dermatitis",
    "Melanoma": "melanoma",
    "Normal": "nevus",
    "Psoriasis": "psoriasis",
    "Basal Cell Carcinoma": "basal cell carcinoma"
}
IMAGES_PER_CLASS = 20  # Keep it small for quick demo setup
DATA_DIR = os.path.join(os.path.dirname(__file__), "dataset")

def download_images():
    os.makedirs(DATA_DIR, exist_ok=True)
    
    for label, query in CLASSES.items():
        print(f"\nFetching images for {label}...")
        class_dir = os.path.join(DATA_DIR, label)
        os.makedirs(class_dir, exist_ok=True)
        
        # Working endpoint: /api/v2/images/
        # Query format: diagnosis:nevus or diagnosis:"atopic dermatitis"
        base_url = "https://api.isic-archive.com/api/v2/images/"
        
        # Format the query correctly
        q_string = f'diagnosis:"{query}"' if " " in query else f'diagnosis:{query}'
        params = {
            "query": q_string,
            "limit": IMAGES_PER_CLASS
        }
        
        try:
            response = requests.get(base_url, params=params)
            if response.status_code != 200:
                print(f"  API Error ({response.status_code}): {response.text}")
                continue
                
            results = response.json().get("results", [])
            if not results:
                print(f"  No results found for {query}")
                continue
            
            downloaded = 0
            for img_info in results:
                if downloaded >= IMAGES_PER_CLASS:
                    break
                    
                img_id = img_info["isic_id"]
                img_path = os.path.join(class_dir, f"{img_id}.jpg")
                
                if os.path.exists(img_path):
                    downloaded += 1
                    continue
                
                # Fetch full-size or thumbnail
                # Using thumbnail for faster setup, but full size is better for training if time allows
                img_url = f"https://api.isic-archive.com/api/v2/images/{img_id}/thumbnail"
                
                img_res = requests.get(img_url)
                if img_res.status_code == 200:
                    with open(img_path, "wb") as f:
                        f.write(img_res.content)
                    downloaded += 1
                    print(f"  [{downloaded}/{len(results)}] Downloaded {img_id}")
                    time.sleep(0.2)
                else:
                    print(f"  Failed to download image {img_id}")
                
        except Exception as e:
            print(f"Error fetching {label}: {e}")

if __name__ == "__main__":
    download_images()
    print("\nDownload complete! Data stored in:", DATA_DIR)
