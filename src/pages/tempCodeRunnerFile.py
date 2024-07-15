import math

def encrypt(plaintext, key):
    # Remove spaces from plaintext
    plaintext = plaintext.replace(" ", "")

    # Calculate number of rows needed
    rows = math.ceil(len(plaintext) / len(key))

    # Pad plaintext with X's to fill out the last row
    plaintext += "X" * (rows * len(key) - len(plaintext))

    # Create a list of column indices based on the key
    indices = [key.index(str(i+1)) for i in range(len(key))]

    # Transpose plaintext into columns
    columns = [plaintext[i:i+rows] for i in range(0, len(plaintext), rows)]

    # Rearrange columns according to key
    columns = [columns[i] for i in indices]

    # Concatenate columns into ciphertext
    ciphertext = "".join(["".join(column) for column in columns])

    return ciphertext

def decrypt(ciphertext, key):
    # Calculate number of rows needed
    rows = math.ceil(len(ciphertext) / len(key))

    # Create a list of column indices based on the key
    indices = [key.index(str(i+1)) for i in range(len(key))]

    # Calculate the length of the last column
    last_column_len = len(ciphertext) % len(key)

    # Split ciphertext into columns
    columns = []
    start = 0
    for i in range(len(key)):
        if i < last_column_len:
            end = start + rows
        else:
            end = start + rows - 1
        columns.append(ciphertext[start:end])
        start = end

    # Rearrange columns according to key
    columns = [columns[indices.index(i)] for i in range(len(key))]

    # Transpose columns into plaintext
    plaintext = "".join(["".join(row) for row in zip(*columns)])

    return plaintext

plaintext = "HELLO WORLD"
key = "4321"

ciphertext = encrypt(plaintext, key)
print(ciphertext)

decrypted_plaintext = decrypt(ciphertext, key)
print(decrypted_plaintext)

# LOWORLHELDXX
# RLWHLOOE
# HELLOWORLDXX
# HLOOELWR
# DXXORLLOWHEL
# LRXDOLOX