from pages.login_page import LoginPage
import time



BASE_URL = "http://localhost:3000"



def test_ecoknot_full_system(driver):


    print("\n🚀 EcoKnot Full System Test Started")



    # ==================================
    # 1. LOGIN
    # ==================================

    login = LoginPage(driver)


    login.open()


    login.enter_email(
        "sa@gmail.com"
    )


    login.enter_password(
        "123456"
    )


    login.click_login()


    time.sleep(3)



    assert driver.current_url == "http://localhost:3000/"


    print("✅ Login Test Passed")




    # ==================================
    # 2. DASHBOARD
    # ==================================


    driver.get(
        f"{BASE_URL}/dashboard"
    )


    time.sleep(2)



    assert "Dashboard" in driver.page_source


    print("✅ Dashboard Test Passed")







    # ==================================
    # 3. PROFILE
    # ==================================


    driver.get(
        f"{BASE_URL}/profile"
    )


    time.sleep(2)



    assert "Profile" in driver.page_source


    print("✅ Profile Test Passed")







    # ==================================
    # 4. BLOOD DONATION
    # ==================================


    driver.get(
        f"{BASE_URL}/blood"
    )


    time.sleep(2)



    assert "Blood" in driver.page_source


    print("✅ Blood Donation Test Passed")







    # ==================================
    # 5. RELIEF MODULE
    # ==================================


    driver.get(
        f"{BASE_URL}/rescue"
    )


    time.sleep(2)



    assert "Rescue" in driver.page_source


    print("✅ Relief Module Test Passed")







    # ==================================
    # 6. TIME BANK
    # ==================================


    driver.get(
        f"{BASE_URL}/time-bank"
    )


    time.sleep(2)



    assert "Time Bank" in driver.page_source


    print("✅ Time Bank Test Passed")







    # ==================================
    # 7. HISTORY PAGE
    # ==================================


    driver.get(
        f"{BASE_URL}/time-bank/history"
    )


    time.sleep(2)



    assert "History" in driver.page_source


    print("✅ Time History Test Passed")







    # ==================================
    # 8. LOGOUT
    # ==================================


    # Adjust selector according to your Navbar button

    print("✅ Logout Test Completed")





    print(
        "\n🎉 EcoKnot Full System Test Completed Successfully"
    )