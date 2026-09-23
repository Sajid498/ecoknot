import time

from pages.auth_helper import AuthHelper



BASE_URL = "http://localhost:3000"



def test_blood_module(driver):


    print("\n🩸 Blood Module Test Started")


    auth = AuthHelper(driver)


    auth.open_authenticated_page(

        f"{BASE_URL}/blood"

    )


    time.sleep(3)



    assert "Blood" in driver.page_source


    print("✅ Blood Page Loaded")