from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import os
import time



# ==========================
# CONFIGURATION
# ==========================

BASE_URL = "http://localhost:3000"

EMAIL = "sa@gmail.com"
PASSWORD = "123456"


SCREENSHOT_DIR = "screenshots"



# ==========================
# BROWSER SETUP
# ==========================

options = Options()

options.add_argument("--start-maximized")

driver = webdriver.Chrome(
    options=options
)

wait = WebDriverWait(
    driver,
    10
)



# ==========================
# CREATE FOLDER
# ==========================

def create_folder(path):

    if not os.path.exists(path):

        os.makedirs(path)



create_folder(
    SCREENSHOT_DIR
)



# ==========================
# SCREENSHOT FUNCTION
# ==========================

def take_screenshot(folder, name):

    path = os.path.join(
        SCREENSHOT_DIR,
        folder
    )

    create_folder(path)


    file_path = os.path.join(
        path,
        name + ".png"
    )


    driver.save_screenshot(
        file_path
    )


    print(
        "Saved:",
        file_path
    )





# ==========================
# NAVIGATION
# ==========================

def open_page(route):

    driver.get(
        BASE_URL + route
    )

    time.sleep(2)





# ==========================
# LOGIN
# ==========================

def login():

    open_page("/login")


    wait.until(
        EC.presence_of_element_located(
            (
                By.TAG_NAME,
                "input"
            )
        )
    )


    inputs = driver.find_elements(
        By.TAG_NAME,
        "input"
    )


    inputs[0].send_keys(
        EMAIL
    )

    inputs[1].send_keys(
        PASSWORD
    )


    button = driver.find_element(
        By.TAG_NAME,
        "button"
    )

    button.click()


time.sleep(2)


# Handle login success alert
try:

    alert = driver.switch_to.alert

    print(
        "Alert:",
        alert.text
    )

    alert.accept()

    time.sleep(2)


except:

    pass



print(
    "Login completed"
)





# ==========================
# PUBLIC PAGES
# ==========================

def capture_public():


    open_page("/")

    take_screenshot(
        "Authentication",
        "Homepage"
    )



    open_page("/login")

    take_screenshot(
        "Authentication",
        "Login"
    )



    open_page("/signup")

    take_screenshot(
        "Authentication",
        "Signup"
    )





# ==========================
# USER MODULE
# ==========================

def capture_user():


    open_page("/dashboard")

    take_screenshot(
        "Dashboard",
        "Dashboard"
    )


    open_page("/profile")

    take_screenshot(
        "Dashboard",
        "Profile"
    )


    open_page("/notifications")

    take_screenshot(
        "Dashboard",
        "Notifications"
    )





# ==========================
# RESOURCE MODULE
# ==========================

def capture_resource():


    open_page("/resources")

    take_screenshot(
        "Resource",
        "Resource_Feed"
    )


    open_page("/resources/create")

    take_screenshot(
        "Resource",
        "Create_Resource"
    )


    open_page("/saved-resources")

    take_screenshot(
        "Resource",
        "Saved_Resources"
    )





# ==========================
# RELIEF MODULE
# ==========================

def capture_relief():


    open_page("/rescue")

    take_screenshot(
        "Relief",
        "Relief_Home"
    )


    open_page("/rescue/create")

    take_screenshot(
        "Relief",
        "Create_Relief_Post"
    )


    open_page("/rescue/dashboard")

    take_screenshot(
        "Relief",
        "Relief_Dashboard"
    )


    open_page("/pickup-requests")

    take_screenshot(
        "Relief",
        "Pickup_Requests"
    )





# ==========================
# TIME BANK
# ==========================

def capture_timebank():


    open_page("/time-bank")

    take_screenshot(
        "TimeBank",
        "Overview"
    )


    open_page("/time-bank/create")

    take_screenshot(
        "TimeBank",
        "Create_Offer"
    )


    open_page("/time-bank/request")

    take_screenshot(
        "TimeBank",
        "Create_Request"
    )


    open_page("/time-bank/history")

    take_screenshot(
        "TimeBank",
        "History"
    )





# ==========================
# BLOOD DONATION
# ==========================

def capture_blood():


    open_page("/blood-donation")

    take_screenshot(
        "Blood",
        "Blood_Home"
    )


    open_page("/blood-donation/create")

    take_screenshot(
        "Blood",
        "Create_Blood_Request"
    )


    open_page("/donation-history")

    take_screenshot(
        "Blood",
        "Donation_History"
    )





# ==========================
# FUNDRAISING
# ==========================

def capture_fundraising():


    open_page("/fundraising")

    take_screenshot(
        "Fundraising",
        "Campaign_List"
    )


    open_page("/fundraising/create")

    take_screenshot(
        "Fundraising",
        "Create_Campaign"
    )


    open_page("/fundraising/my-campaigns")

    take_screenshot(
        "Fundraising",
        "My_Campaigns"
    )





# ==========================
# COMMUNICATION
# ==========================

def capture_chat():


    open_page("/messages")

    take_screenshot(
        "Communication",
        "Messages"
    )





# ==========================
# MAIN
# ==========================

try:


    print(
        "Taking public screenshots..."
    )

    capture_public()



    print(
        "Login..."
    )

    login()



    print(
        "Taking user screenshots..."
    )

    capture_user()


    capture_resource()

    capture_relief()

    capture_timebank()

    capture_blood()

    capture_fundraising()

    capture_chat()



    print(
        "\nAll screenshots completed successfully!"
    )


finally:


    driver.quit()