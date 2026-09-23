from pages.login_page import LoginPage



def test_login(driver):


    login = LoginPage(driver)


    login.open()


    login.enter_email(
        "sa@gmail.com"
    )


    login.enter_password(
        "123456"
    )


    login.click_login()



    assert driver.current_url == "http://localhost:3000/"