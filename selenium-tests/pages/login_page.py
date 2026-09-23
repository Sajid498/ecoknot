from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class LoginPage:


    def __init__(self, driver):

        self.driver = driver



    email_input = (

        By.CSS_SELECTOR,

        "input[placeholder='Enter your email']"

    )



    password_input = (

        By.CSS_SELECTOR,

        "input[placeholder='Enter your password']"

    )



    login_button = (

        By.XPATH,

        "//button[contains(text(),'Login')]"

    )





    def open(self):

        self.driver.get(

            "http://localhost:3000/login"

        )





    def enter_email(self,email):

        self.driver.find_element(

            *self.email_input

        ).send_keys(email)





    def enter_password(self,password):

        self.driver.find_element(

            *self.password_input

        ).send_keys(password)





    def click_login(self):

     self.driver.find_element(
         *self.login_button
    ).click()



    try:

        alert = WebDriverWait(
            self.driver,
            5
        ).until(
            EC.alert_is_present()
        )


        alert.accept()


    except:

        pass