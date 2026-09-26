import json
import time
from datetime import datetime, timedelta

from selenium import webdriver
from selenium.common.exceptions import ElementClickInterceptedException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


BASE_URL = "http://localhost:3000"
API_URL = "http://localhost:8080"

RUN_ID = str(int(time.time()))
PASSWORD = "Ab#12345"

USER_A = {
    "name": f"Eco Test A {RUN_ID}",
    "email": f"ecotest.a.{RUN_ID}@example.com",
    "password": PASSWORD,
    "blood_group": "O_POSITIVE",
}

USER_B = {
    "name": f"Eco Test B {RUN_ID}",
    "email": f"ecotest.b.{RUN_ID}@example.com",
    "password": PASSWORD,
    "blood_group": "A_POSITIVE",
}

RESOURCE_TEXT = f"Selenium resource {RUN_ID}"
RELIEF_TITLE = f"Selenium Food Packets {RUN_ID}"
TIME_OFFER_TITLE = f"Selenium Java Help {RUN_ID}"
TIME_REQUEST_TITLE = f"Selenium Math Help {RUN_ID}"
BLOOD_PATIENT = f"Selenium Patient {RUN_ID}"
FUND_TITLE = f"Selenium Medical Fund {RUN_ID}"
CHAT_TEXT_B = f"Hello from user B {RUN_ID}"
CHAT_TEXT_A = f"Reply from user A {RUN_ID}"
COMMENT_TEXT = f"Useful resource {RUN_ID}"

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_argument("--disable-notifications")
options.add_argument("--disable-popup-blocking")
options.add_argument("--window-size=1600,1000")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 15)

passed = []
failed = []

A = None
B = None
resource_id = None
rescue_id = None
pickup_id = None
time_request_id = None
blood_request_id = None
donation_response_id = None
fund_id = None


def log(message):
    print(message, flush=True)


def pass_step(name):
    passed.append(name)
    log(f"✅ {name}")


def fail_step(name, error):
    failed.append((name, str(error)))
    log(f"❌ {name}: {error}")


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def go(path):
    driver.get(BASE_URL + path)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))


def body_text():
    return driver.find_element(By.TAG_NAME, "body").text


def accept_alert_if_present(timeout=5):
    try:
        alert = WebDriverWait(driver, timeout).until(EC.alert_is_present())
        text = alert.text
        alert.accept()
        return text
    except TimeoutException:
        return None


def input_by_placeholder(placeholder, value, tag="input"):
    element = wait.until(
        EC.presence_of_element_located(
            (By.XPATH, f'//{tag}[@placeholder="{placeholder}"]')
        )
    )
    element.clear()
    element.send_keys(value)
    return element


def click_button(text):
    button = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, f'//button[contains(normalize-space(.), "{text}")]')
        )
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block:'center'});",
        button,
    )

    try:
        button.click()
    except ElementClickInterceptedException:
        driver.execute_script(
            "arguments[0].click();",
            button,
        )

    return button


def set_input_value(css_selector, value):
    element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, css_selector))
    )
    driver.execute_script(
        """
        const el = arguments[0];
        const value = arguments[1];
        const prototype =
            el instanceof HTMLTextAreaElement
                ? HTMLTextAreaElement.prototype
                : HTMLInputElement.prototype;
        const setter =
            Object.getOwnPropertyDescriptor(prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", {bubbles:true}));
        el.dispatchEvent(new Event("change", {bubbles:true}));
        """,
        element,
        value,
    )
    return element


def api(method, path, body=None):
    result = driver.execute_async_script(
        """
        const method = arguments[0];
        const url = arguments[1];
        const body = arguments[2];
        const done = arguments[arguments.length - 1];

        const token = localStorage.getItem("token");
        const headers = {};

        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }

        if (body !== null) {
            headers["Content-Type"] = "application/json";
        }

        fetch(url, {
            method,
            headers,
            body: body !== null ? JSON.stringify(body) : undefined
        })
        .then(async response => {
            const text = await response.text();
            let data = text;

            try {
                data = text ? JSON.parse(text) : null;
            }
            catch (_) {}

            done({
                ok: response.ok,
                status: response.status,
                data
            });
        })
        .catch(error => {
            done({
                ok: false,
                status: 0,
                data: String(error)
            });
        });
        """,
        method,
        API_URL + path,
        body,
    )

    if not result["ok"]:
        raise AssertionError(
            f"API {method} {path} failed: "
            f"status={result['status']} "
            f"data={result['data']}"
        )

    return result["data"]


def local_user():
    raw = driver.execute_script('return localStorage.getItem("user");')
    require(raw, "localStorage.user was not created")
    return json.loads(raw)


def signup(user):
    go("/signup")
    input_by_placeholder("Enter your name", user["name"])
    input_by_placeholder("Enter your email", user["email"])
    input_by_placeholder("Create password", user["password"])

    selects = driver.find_elements(By.TAG_NAME, "select")
    require(selects, "Signup blood group select not found")
    Select(selects[-1]).select_by_value(user["blood_group"])

    click_button("Signup")
    alert_text = accept_alert_if_present()

    require(
        alert_text and "successful" in alert_text.lower(),
        f"Signup failed: {alert_text}",
    )

    wait.until(EC.url_contains("/login"))


def login(user):
    go("/login")

    email = wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, 'input[type="email"]')
        )
    )

    password = driver.find_element(
        By.CSS_SELECTOR,
        'input[type="password"]',
    )

    email.clear()
    email.send_keys(user["email"])
    password.clear()
    password.send_keys(user["password"])

    click_button("Login")
    alert_text = accept_alert_if_present()

    require(
        alert_text and "successful" in alert_text.lower(),
        f"Login failed: {alert_text}",
    )

    wait.until(
        lambda d:
            d.current_url.rstrip("/") == BASE_URL.rstrip("/")
    )

    stored_user = local_user()
    token = driver.execute_script(
        'return localStorage.getItem("token");'
    )

    require(token, "JWT token was not saved")
    require(
        stored_user.get("email") == user["email"],
        "Wrong user stored after login",
    )

    return stored_user


def logout():
    go("/")

    account_button = wait.until(
        EC.element_to_be_clickable(
            (
                By.CSS_SELECTOR,
                'button[aria-label="Open account menu"]',
            )
        )
    )

    account_button.click()
    click_button("Logout")

    wait.until(EC.url_contains("/login"))

    token = driver.execute_script(
        'return localStorage.getItem("token");'
    )

    require(token is None, "Token still exists after logout")


def run_step(name, fn, fatal=False):
    try:
        fn()
        pass_step(name)
        return True
    except Exception as error:
        fail_step(name, error)
        if fatal:
            raise
        return False


def test_logged_out_home():
    go("/")
    text = body_text()

    for label in [
        "Log In",
        "Sign Up",
        "Blood Donation",
        "Resource Sharing",
        "Relief Hub",
        "Fundraising",
        "Time Bank",
    ]:
        require(
            label in text,
            f"Missing homepage text: {label}",
        )

    headers = driver.find_elements(By.TAG_NAME, "header")
    require(
        len(headers) == 0,
        "Navbar visible while logged out",
    )


def test_signup_users():
    signup(USER_A)
    signup(USER_B)


def test_login_a():
    global A
    A = login(USER_A)
    require(A.get("id"), "User A ID missing")


def test_profile_dashboard():
    go("/profile")
    require("Profile" in body_text(), "Profile page did not render")

    go("/dashboard")
    require("Dashboard" in body_text(), "Dashboard page did not render")


def test_resource_create():
    global resource_id

    go("/resources/create")
    input_by_placeholder(
        "Write your resource...",
        RESOURCE_TEXT,
        tag="textarea",
    )
    click_button("Create Post")
    wait.until(lambda d: d.current_url.rstrip("/") == (BASE_URL + "/resources").rstrip("/"))

    resources = api("GET", "/api/resources")

    resource = next(
        (
            item
            for item in resources
            if item.get("content") == RESOURCE_TEXT
        ),
        None,
    )

    require(resource, "Created resource not found")
    resource_id = resource["id"]


def test_relief_create():
    global rescue_id

    go("/rescue/create")
    input_by_placeholder(
        "Example: 100 Food Packets",
        RELIEF_TITLE,
    )
    input_by_placeholder(
        "Describe the donation",
        "Fresh food packets created by Selenium",
        tag="textarea",
    )
    input_by_placeholder("Example: 100", "10")
    input_by_placeholder("Example: Dhanmondi", "Dhanmondi")
    input_by_placeholder("Latitude", "23.7465")
    input_by_placeholder("Longitude", "90.3760")

    expiry = (
        datetime.now() + timedelta(days=2)
    ).strftime("%Y-%m-%dT%H:%M")

    set_input_value(
        'input[type="datetime-local"]',
        expiry,
    )

    click_button("Create Relief Post")
    wait.until(lambda d: d.current_url.rstrip("/") == (BASE_URL + "/rescue").rstrip("/"))

    rescues = api(
        "GET",
        f"/api/rescues/user/{A['id']}",
    )

    rescue = next(
        (
            item
            for item in rescues
            if item.get("title") == RELIEF_TITLE
        ),
        None,
    )

    require(rescue, "Created relief post not found")
    rescue_id = rescue["id"]


def test_time_bank_create():
    global time_request_id

    go("/time-bank/create")

    input_by_placeholder(
        "Example: Java Teaching",
        TIME_OFFER_TITLE,
    )

    input_by_placeholder(
        "Education, Design, Repair...",
        "Education",
    )

    input_by_placeholder(
        "Describe your help...",
        "Java basics tutoring",
        tag="textarea",
    )

    input_by_placeholder(
        "Example: 3",
        "3",
    )

    click_button("Create Offer")

    wait.until(
        lambda d:
            d.current_url.rstrip("/")
            ==
            (BASE_URL + "/time-bank").rstrip("/")
    )

    go("/time-bank/request")

    input_by_placeholder(
        "Example: Need Math Tutor",
        TIME_REQUEST_TITLE,
    )

    input_by_placeholder(
        "Explain what help you need",
        "Need two hours of math help",
        tag="textarea",
    )

    input_by_placeholder(
        "Education, Repair, Translation...",
        "Education",
    )

    input_by_placeholder(
        "2",
        "2",
    )

    click_button("Create Request")

    alert_text = accept_alert_if_present(
        timeout=10
    )

    require(
        alert_text
        and
        "successfully"
        in
        alert_text.lower(),
        f"Time Bank request success alert missing: {alert_text}",
    )

    wait.until(
        lambda d:
            d.current_url.rstrip("/")
            ==
            (BASE_URL + "/time-bank").rstrip("/")
    )

    requests = api(
        "GET",
        f"/api/time-bank/my-requests/{A['id']}",
    )

    request = next(
        (
            item
            for item in requests
            if item.get("title")
            ==
            TIME_REQUEST_TITLE
        ),
        None,
    )

    require(
        request,
        "Time request not found",
    )

    time_request_id = request["id"]

    balance = api(
        "GET",
        f"/api/time-bank/balance/{A['id']}",
    )

    require(
        int(balance) == 5,
        f"Starter balance expected 5, got {balance}",
    )


def test_blood_request_create():
    global blood_request_id

    go("/blood-donation/create")

    input_by_placeholder(
        "Patient Name",
        BLOOD_PATIENT,
    )

    blood_select = wait.until(
        EC.presence_of_element_located(
            (
                By.CSS_SELECTOR,
                'select[name="bloodGroup"]',
            )
        )
    )

    Select(
        blood_select
    ).select_by_value(
        "A_POSITIVE"
    )

    input_by_placeholder(
        "Hospital Name",
        "Selenium General Hospital",
    )

    input_by_placeholder(
        "Location",
        "Dhaka",
    )

    input_by_placeholder(
        "Contact Number",
        "01700000000",
    )

    required_date = (
        datetime.now()
        +
        timedelta(days=2)
    ).strftime(
        "%Y-%m-%d"
    )

    set_input_value(
        'input[name="requiredDate"]',
        required_date,
    )

    units = wait.until(
        EC.presence_of_element_located(
            (
                By.CSS_SELECTOR,
                'input[name="unitsNeeded"]',
            )
        )
    )

    units.clear()
    units.send_keys(
        "1"
    )

    urgency_select = wait.until(
        EC.presence_of_element_located(
            (
                By.CSS_SELECTOR,
                'select[name="urgency"]',
            )
        )
    )

    Select(
        urgency_select
    ).select_by_value(
        "URGENT"
    )

    input_by_placeholder(
        "Additional information",
        "Selenium E2E blood request",
        tag="textarea",
    )

    click_button(
        "Create Request"
    )

    # If page shows a success alert, accept it
    alert_text = accept_alert_if_present(
        timeout=5
    )

    if alert_text:
        print(
            f"Blood request alert: {alert_text}"
        )

    # Give frontend/backend a moment to finish creation
    time.sleep(
        1
    )

    requests = api(
        "GET",
        f"/api/blood-requests/user/{A['id']}",
    )

    request = next(
        (
            item
            for item in requests
            if item.get("patientName")
            ==
            BLOOD_PATIENT
        ),
        None,
    )

    require(
        request,
        (
            "Blood request was not found after form submission. "
            f"API returned: {requests}"
        ),
    )

    blood_request_id = request[
        "id"
    ]

    require(
        blood_request_id,
        "Blood request ID missing",
    )

def test_fundraising_create():
    global fund_id

    go("/fundraising/create")
    input_by_placeholder("Campaign title", FUND_TITLE)
    input_by_placeholder("Target amount (BDT)", "5000")
    input_by_placeholder("Beneficiary name", USER_A["name"])
    input_by_placeholder("Location", "Dhaka")
    input_by_placeholder("Contact number", "01800000000")

    input_by_placeholder(
        "Explain the need, use of funds, and relevant verification details",
        "Selenium generated campaign for end-to-end testing.",
        tag="textarea",
    )

    click_button("Submit for review")
    wait.until(
        lambda d:
            d.current_url.rstrip("/")
            ==
            (BASE_URL + "/fundraising/my-campaigns").rstrip("/")
    )

    campaigns = api(
        "GET",
        f"/api/funds/user/{A['id']}",
    )

    fund = next(
        (
            campaign
            for campaign in campaigns
            if campaign.get("title") == FUND_TITLE
        ),
        None,
    )

    require(fund, "Fundraising campaign not found")
    fund_id = fund.get("id")


def test_switch_to_b():
    global B

    logout()
    B = login(USER_B)
    require(B.get("id"), "User B ID missing")


def test_resource_interactions():
    require(resource_id, "Resource ID missing")

    api(
        "PUT",
        f"/api/resources/{resource_id}/like",
    )

    api(
        "PUT",
        f"/api/resources/{resource_id}/share",
    )

    api(
        "POST",
        (
            f"/api/bookmarks/save"
            f"?userId={B['id']}"
            f"&resourceId={resource_id}"
        ),
    )

    api(
        "POST",
        (
            f"/api/resources/{resource_id}/comments"
            f"?userId={B['id']}"
        ),
        {"content": COMMENT_TEXT},
    )

    saved = api(
        "GET",
        (
            f"/api/bookmarks/check"
            f"?userId={B['id']}"
            f"&resourceId={resource_id}"
        ),
    )

    require(saved is True, "Bookmark not saved")


def test_time_bank_accept():
    require(time_request_id, "Time request ID missing")

    accepted = api(
        "PUT",
        (
            f"/api/time-bank/accept/{time_request_id}"
            f"?helperId={B['id']}"
        ),
    )

    require(
        accepted.get("status") == "ACCEPTED",
        f"Unexpected Time Bank status: {accepted}",
    )


def test_pickup_request():
    global pickup_id

    require(rescue_id, "Rescue ID missing")

    pickup = api(
        "POST",
        (
            f"/api/pickups"
            f"?rescueId={rescue_id}"
            f"&volunteerId={B['id']}"
        ),
    )

    pickup_id = pickup.get("id")

    require(
        pickup_id,
        f"Pickup ID missing: {pickup}",
    )

    require(
        pickup.get("status") == "PENDING",
        "Pickup was not PENDING",
    )


def test_blood_donor_apply():
    global donation_response_id

    require(
        blood_request_id,
        "Blood request ID missing",
    )

    eligibility = api(
        "GET",
        f"/api/users/{B['id']}/eligibility",
    )

    if isinstance(eligibility, dict):
        require(
            eligibility.get("eligible") is True,
            f"User B not eligible: {eligibility}",
        )

    donation = api(
        "POST",
        "/api/donation-response",
        {
            "requestId": blood_request_id,
            "donorId": B["id"],
            "donorName": B.get(
                "name",
                USER_B["name"],
            ),
            "donorEmail": B.get(
                "email",
                USER_B["email"],
            ),
            "donorPhone": "01900000000",
        },
    )

    donation_response_id = donation.get("id")

    require(
        donation_response_id,
        "Donation response ID missing",
    )


def test_chat_b_to_a():
    api(
        "POST",
        "/api/chat/send",
        {
            "senderId": B["id"],
            "receiverId": A["id"],
            "requestId": blood_request_id,
            "message": CHAT_TEXT_B,
        },
    )

    inbox = api(
        "GET",
        f"/api/chat/inbox/{B['id']}",
    )

    require(
        any(
            message.get("message") == CHAT_TEXT_B
            for message in inbox
        ),
        "Chat message missing",
    )


def test_switch_back_to_a():
    global A

    logout()
    A = login(USER_A)


def test_time_bank_complete():
    transaction = api(
        "PUT",
        (
            f"/api/time-bank/complete/{time_request_id}"
            f"?requesterId={A['id']}"
        ),
    )

    require(
        transaction.get("transactionType") == "TRANSFER",
        "TRANSFER transaction not created",
    )

    balance = int(
        api(
            "GET",
            f"/api/time-bank/balance/{A['id']}",
        )
    )

    require(
        balance == 3,
        f"User A balance expected 3, got {balance}",
    )


def test_pickup_approve():
    approved = api(
        "PUT",
        (
            f"/api/pickups/{pickup_id}/approve"
            f"?userId={A['id']}"
        ),
    )

    require(
        approved.get("status") == "APPROVED",
        "Pickup not approved",
    )


def test_blood_accept_complete():
    accepted = api(
        "PUT",
        (
            f"/api/donation-response/{donation_response_id}"
            f"?status=ACCEPTED"
            f"&requesterId={A['id']}"
        ),
    )

    require(
        accepted.get("status") == "ACCEPTED",
        "Donation not accepted",
    )

    completed = api(
        "PUT",
        (
            f"/api/donation-response/"
            f"{donation_response_id}/complete"
            f"?requesterId={A['id']}"
        ),
    )

    require(
        completed.get("status") == "COMPLETED",
        "Donation not completed",
    )


def test_chat_a_to_b():
    api(
        "POST",
        "/api/chat/send",
        {
            "senderId": A["id"],
            "receiverId": B["id"],
            "requestId": blood_request_id,
            "message": CHAT_TEXT_A,
        },
    )

    conversation = api(
        "GET",
        (
            f"/api/chat/{A['id']}/{B['id']}"
            f"/request/{blood_request_id}"
        ),
    )

    messages = [
        message.get("message")
        for message in conversation
    ]

    require(
        CHAT_TEXT_B in messages,
        "User B message missing",
    )

    require(
        CHAT_TEXT_A in messages,
        "User A reply missing",
    )


def test_notifications():
    notifications = api(
        "GET",
        f"/api/notifications/user/{A['id']}",
    )

    require(
        isinstance(notifications, list),
        "Notification result not a list",
    )

    require(
        len(notifications) > 0,
        "No notifications generated",
    )


def test_fundraising_my_campaigns():
    campaigns = api(
        "GET",
        f"/api/funds/user/{A['id']}",
    )

    fund = next(
        (
            campaign
            for campaign in campaigns
            if campaign.get("title") == FUND_TITLE
        ),
        None,
    )

    require(fund, "Campaign disappeared")


def test_relief_delivery_and_histories():
    global B

    logout()
    B = login(USER_B)

    picked = api(
        "PUT",
        f"/api/pickups/{pickup_id}/pickup",
    )

    require(
        picked.get("status") == "PICKED_UP",
        "Pickup status not PICKED_UP",
    )

    delivered = api(
        "PUT",
        f"/api/pickups/{pickup_id}/deliver",
    )

    require(
        delivered.get("status") == "DELIVERED",
        "Pickup status not DELIVERED",
    )

    rescue = api(
        "GET",
        f"/api/rescues/{rescue_id}",
    )

    require(
        rescue.get("status") == "DELIVERED",
        "Relief post status not DELIVERED",
    )

    balance = int(
        api(
            "GET",
            f"/api/time-bank/balance/{B['id']}",
        )
    )

    require(
        balance == 7,
        f"User B balance expected 7, got {balance}",
    )


def test_logout_protected_route():
    logout()
    go("/profile")
    wait.until(
        EC.url_contains("/login")
    )


try:
    run_step(
        "Logged-out homepage + module cards",
        test_logged_out_home,
        fatal=True,
    )
    run_step(
        "Signup User A + User B",
        test_signup_users,
        fatal=True,
    )
    run_step(
        "Login + JWT + navbar",
        test_login_a,
        fatal=True,
    )
    run_step(
        "Profile + Dashboard",
        test_profile_dashboard,
    )
    run_step(
        "Resource Sharing: create + feed",
        test_resource_create,
    )
    run_step(
        "Relief Hub: create post",
        test_relief_create,
    )
    run_step(
        "Time Bank: offer + request + starter credits",
        test_time_bank_create,
    )
    run_step(
        "Blood Donation: create request",
        test_blood_request_create,
    )
    run_step(
        "Fundraising: create campaign",
        test_fundraising_create,
    )
    run_step(
        "Multi-user switch: User B",
        test_switch_to_b,
        fatal=True,
    )
    run_step(
        "Resource interactions",
        test_resource_interactions,
    )
    run_step(
        "Time Bank accept",
        test_time_bank_accept,
    )
    run_step(
        "Relief pickup request",
        test_pickup_request,
    )
    run_step(
        "Blood donor apply",
        test_blood_donor_apply,
    )
    run_step(
        "Chat B to A",
        test_chat_b_to_a,
    )
    run_step(
        "Switch back to A",
        test_switch_back_to_a,
        fatal=True,
    )
    run_step(
        "Time Bank complete",
        test_time_bank_complete,
    )
    run_step(
        "Pickup approve",
        test_pickup_approve,
    )
    run_step(
        "Blood accept + complete",
        test_blood_accept_complete,
    )
    run_step(
        "Chat A to B",
        test_chat_a_to_b,
    )
    run_step(
        "Notifications",
        test_notifications,
    )
    run_step(
        "Fundraising my campaigns",
        test_fundraising_my_campaigns,
    )
    run_step(
        "Relief delivery + helper balance",
        test_relief_delivery_and_histories,
    )
    run_step(
        "Logout + protected route",
        test_logout_protected_route,
    )

finally:
    print()
    log("=" * 70)
    log("ECOKNOT FULL USER-SIDE SELENIUM REPORT")
    log("=" * 70)

    for name in passed:
        log(f"PASS ✅ {name}")

    for name, error in failed:
        log(f"FAIL ❌ {name}")
        log(f"       {error}")

    log("-" * 70)
    log(f"Passed: {len(passed)}")
    log(f"Failed: {len(failed)}")

    if not failed:
        log("🎉 ALL CURRENT NON-ADMIN E2E CHECKS PASSED")
    else:
        log("⚠️ Some checks failed. Send me the first FAIL.")

    log("=" * 70)

    time.sleep(2)
    driver.quit()


if failed:
    raise SystemExit(1)
