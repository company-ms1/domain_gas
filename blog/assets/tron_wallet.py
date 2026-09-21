"""Local TRON key generation. Educational example, not an audited wallet."""
import argparse

from tronpy.keys import PrivateKey


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true",
                        help="Use a PUBLIC example key. Never send funds to it.")
    args = parser.parse_args()

    if args.demo:
        key = PrivateKey(bytes.fromhex("00" * 31 + "01"))
        print("DEMO ONLY - PUBLIC KEY MATERIAL - DO NOT SEND FUNDS")
    else:
        key = PrivateKey.random()
        print("SECRET - keep this output offline and private")

    print("Private key:", key.hex())
    print("TRON address:", key.public_key.to_base58check_address())


if __name__ == "__main__":
    main()
