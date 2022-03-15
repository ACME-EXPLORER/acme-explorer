resource "aws_instance" "machine01" {
  ami                         = "ami-007fae589fdf6e955"
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.sg_do2122-latam.id]

  root_block_device {
    volume_size = 20 #20 Gb
  }

  tags = {
    Name        = "${var.author}.machine01"
    Author      = var.author
    Date        = "2022.03.11"
    Environment = "LAB"
    Location    = "Paris"
    Project     = "DO2122-LATAM"
  }

  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file(var.key_path)
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y docker httpd-tools git",
      "sudo usermod -a -G docker ec2-user",
      "sudo curl -L https://github.com/docker/compose/releases/download/1.22.0-rc2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo chkconfig docker on",
      "sudo service docker start",
      "mkdir /home/ec2-user/config"
    ]
  }

  provisioner "file" {
    source      = "../mongo-init.js"
    destination = "/home/ec2-user/config/mongo-init.js"
  }

  provisioner "file" {
    source      = "docker-compose.yml"
    destination = "/home/ec2-user/docker-compose.yml"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo /usr/local/bin/docker-compose up backend"
    ]
  }
}
