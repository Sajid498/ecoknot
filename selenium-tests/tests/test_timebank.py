import time

from pages.auth_helper import AuthHelper



BASE_URL = "http://localhost:3000"



def test_timebank_module(driver):


    print("\n⏳ Time Bank Test Started")


    auth = AuthHelper(driver)


    auth.open_authenticated_page(

        f"{BASE_URL}/time-bank"

    )


    time.sleep(3)



    assert "Time Bank" in driver.page_source


    print("✅ Time Bank Page Loaded")