from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time



class AuthHelper:


    def __init__(self, driver):

        self.driver = driver



    def set_user_session(self):


        user = {

            "id": 1,

            "name": "Selenium Tester",

            "email": "sa@gmail.com",

            "role": "USER"

        }



        self.driver.execute_script(

            """
            localStorage.setItem(
                'user',
                arguments[0]
            );
            """,

            json.dumps(user)

        )


        time.sleep(1)



    def open_authenticated_page(self, url):


        self.driver.get(

            url

        )


        self.set_user_session()


        self.driver.refresh()


        time.sleep(2)