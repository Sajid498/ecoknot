def test_home_page(driver):


    driver.get(
        "http://localhost:3000"
    )


    title = driver.title


    assert title != ""