import time

from pages.auth_helper import AuthHelper


BASE_URL = "http://localhost:3000"



def test_profile_module(driver):


    print("\n👤 Profile Module Test Started")


    auth = AuthHelper(driver)


    auth.open_authenticated_page(

        f"{BASE_URL}/profile"

    )


    time.sleep(3)



    assert "Profile" in driver.page_source


    print("✅ Profile Page Loaded")