import pytest



if __name__ == "__main__":


    print(
        "\n🚀 Starting EcoKnot Complete System Automation Test\n"
    )



    test_files = [


        "tests/test_home.py",


        "tests/test_profile.py",


        "tests/test_dashboard.py",


        "tests/test_blood.py",


        "tests/test_relief.py",


        "tests/test_pickup.py",


        "tests/test_timebank.py",


        "tests/test_notification.py",


        "tests/test_navigation.py",


        "tests/test_error_handling.py",


        "tests/test_full_system.py"


    ]





    result = pytest.main(

        test_files +

        [

            "-v",

            "--tb=short"

        ]

    )





    print(

        "\n🏁 EcoKnot Automation Test Finished\n"

    )



    if result == 0:


        print(

            "🎉 ALL TESTS PASSED"

        )


    else:


        print(

            "❌ SOME TESTS FAILED"

        )



    exit(result)